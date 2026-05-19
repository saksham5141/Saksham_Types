import os
import sys
import socket
import threading
import http.server
import socketserver
import webview

def get_free_port():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('localhost', 0))
    port = s.getsockname()[1]
    s.close()
    return port

def get_resource_path():
    if hasattr(sys, '_MEIPASS'):
        return sys._MEIPASS
    return os.path.dirname(os.path.abspath(__file__))

def start_server(port, directory):
    class QuietHTTPHandler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, format, *args):
            pass

    # Ensure python resolves paths inside the directory correctly
    os.chdir(directory)
    handler = QuietHTTPHandler
    # Enable reuse address to avoid socket binding errors
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('localhost', port), handler) as httpd:
        httpd.serve_forever()

if __name__ == '__main__':
    port = get_free_port()
    directory = get_resource_path()
    
    # Run the HTTP server in a background daemon thread
    server_thread = threading.Thread(target=start_server, args=(port, directory), daemon=True)
    server_thread.start()
    
    # Open native browser window
    url = f'http://localhost:{port}/index.html'
    
    webview.create_window(
        title='Saksham Types Pro',
        url=url,
        width=1280,
        height=820,
        min_size=(950, 650),
        resizable=True
    )
    
    webview.start()
