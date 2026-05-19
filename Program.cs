using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Hosting;
using YouTubeAudioDownloader.Data;
using YouTubeAudioDownloader.Services;
using YouTubeAudioDownloader.Middleware;
using YouTubeAudioDownloader.Models;   // for SmtpSettings
using System.Net;
using System;
using System.Linq;                 // for FirstOrDefault()
using Microsoft.Extensions.DependencyInjection; // for GetRequiredService<T>()


// Create builder
var builder = WebApplication.CreateBuilder(args);

// 1. Add MVC + Razor
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

// 2. Register view-render service
builder.Services.AddSingleton<IViewRenderService, ViewRenderService>();

// 3. Configure MariaDB via Pomelo
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString),
        mysqlOptions => mysqlOptions.EnableStringComparisonTranslations()
    )
);

// 4. Register HttpContextAccessor for logging and context access
builder.Services.AddHttpContextAccessor();

// 5. Register activity logger (for login events and startup)
builder.Services.AddScoped<IActivityLogger, ActivityLogger>();

// 6. Configure Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 8;
    options.Password.RequiredUniqueChars = 1;
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;
    options.User.AllowedUserNameCharacters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultUI()
.AddDefaultTokenProviders();

// 6b. Log login events (no AccountController required)
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnSignedIn = async context =>
    {
        try
        {
            var logger = context.HttpContext.RequestServices.GetRequiredService<IActivityLogger>();
            var userName = context.Principal?.Identity?.Name ?? "Unknown";
            var httpContext = context.HttpContext;
            string ipAddress = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()
                ?? httpContext.Connection.RemoteIpAddress?.ToString();
            await logger.LogSecurityEventAsync(
                "LoginSuccess",
                $"User {userName} logged in successfully",
                userName,
                ipAddress
            );
        }
        catch { /* Don't break login if logging fails */ }
    };
});

// 7. HttpClient factory
builder.Services.AddHttpClient();

// after builder.Services.AddHttpClient();
builder.Services.Configure<SmtpSettings>(
    builder.Configuration.GetSection("SmtpSettings"));
builder.Services.AddSingleton<IEmailSender, SmtpEmailSender>();


// 8. Kestrel on port 5000
builder.WebHost.ConfigureKestrel(opts =>
{
    opts.ListenAnyIP(5005);
});

// Build app
var app = builder.Build();

// 9. Forwarded headers (Cloudflare, VPS trusted)
var cloudflareNetworks = new[]
{
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("103.21.244.0"), 22),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("103.22.200.0"), 22),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("103.31.4.0"), 22),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("104.16.0.0"), 13),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("104.24.0.0"), 14),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("108.162.192.0"), 18),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("131.0.72.0"), 22),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("141.101.64.0"), 18),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("162.158.0.0"), 15),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("172.64.0.0"), 13),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("173.245.48.0"), 20),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("188.114.96.0"), 20),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("190.93.240.0"), 20),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("197.234.240.0"), 22),
    new Microsoft.AspNetCore.HttpOverrides.IPNetwork(IPAddress.Parse("198.41.128.0"), 17),
};

var vpsProxyIp = IPAddress.Parse("147.93.106.66");
var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
};
forwardedHeadersOptions.KnownProxies.Add(vpsProxyIp);
foreach (var network in cloudflareNetworks)
    forwardedHeadersOptions.KnownNetworks.Add(network);

app.UseForwardedHeaders(forwardedHeadersOptions);


app.UseErrorNotifications();


// 10. Error handling & middleware
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error/500");
    app.UseStatusCodePagesWithReExecute("/Error/{0}");
    app.UseHsts();
}
else
{
    app.UseDeveloperExceptionPage();
}

// 11. Force HTTPS
//app.UseHttpsRedirection();

// 12. Redirect non-www → www
//var rewriteOptions = new RewriteOptions().AddRedirectToWwwPermanent();
//app.UseRewriter(rewriteOptions);

// 13. Custom Logging Middleware
app.UseMiddleware<RequestLoggingMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();

// 14. Static files, routing, auth
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

// 15. Routing endpoints
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

// 16. Migrate & seed database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var ctx     = services.GetRequiredService<AppDbContext>();
        var userMgr = services.GetRequiredService<UserManager<IdentityUser>>();
        var roleMgr = services.GetRequiredService<RoleManager<IdentityRole>>();
        var log     = services.GetRequiredService<ILogger<Program>>();

        // ✅ Fixed
        var pendingMigrations = await ctx.Database.GetPendingMigrationsAsync();
        if (pendingMigrations.Any())
        {
            await ctx.Database.MigrateAsync();
        }

        
   
        await SeedData.InitializeAsync(userMgr, roleMgr, log);
    }
    catch (Exception ex)
    {
        var log = services.GetRequiredService<ILogger<Program>>();
        log.LogError(ex, "An error occurred while seeding the database.");
    }
}

// 17. Log on every application start (i.e., website restart)
var lifetime       = app.Services.GetRequiredService<IHostApplicationLifetime>();
lifetime.ApplicationStarted.Register(() =>
{
    Task.Run(async () =>
    {
        using var scope = app.Services.CreateScope();
        var activityLogger = scope.ServiceProvider.GetRequiredService<IActivityLogger>();
        await activityLogger.LogAsync(
            eventType: "Application.Restarted",
            entity:    "System",
            entityId:  0,
            userName:  "System",
            details:   $"Restart at {DateTime.UtcNow:O}"
        );
    });
});

app.Run();
