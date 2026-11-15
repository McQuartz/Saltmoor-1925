# Lokaler Server für das Spiel: wie python -m http.server, aber ohne Browser-Cache.
# Grund: Nach einem Branch-Wechsel (git pull/checkout) hat der Browser sonst alte JS/CSS-Dateien aus dem Cache
# mit neuen gemischt. Dann fehlen z. B. Fußleiste und ZUG BEENDEN, und die Karten sind durchsichtig.
# Aufruf: python server.py [port]   (Standard 8000)
import http.server, sys, functools, os

class OhneCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ordner = os.path.dirname(os.path.abspath(__file__))
http.server.ThreadingHTTPServer(('', port), functools.partial(OhneCache, directory=ordner)).serve_forever()
