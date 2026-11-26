import os
import sys
from urllib.parse import parse_qs, urlencode, urlsplit

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app import app as flask_app  # noqa: E402


class VercelPathMiddleware:
    """Restores original request PATH_INFO when Vercel rewrites to /api/index.py."""

    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        qs = environ.get("QUERY_STRING", "")
        if "__vpath=" in qs:
            params = parse_qs(qs, keep_blank_values=True)
            vpath_list = params.pop("__vpath", None)
            if vpath_list:
                vpath = "/" + vpath_list[-1].lstrip("/")
                environ["PATH_INFO"] = vpath
            environ["QUERY_STRING"] = urlencode(params, doseq=True)
        elif environ.get("PATH_INFO", "") in ("/api/index", "/api/index.py"):
            raw = (
                environ.get("HTTP_X_VERCEL_REWRITE_URL")
                or environ.get("HTTP_X_FORWARDED_URI")
                or environ.get("REQUEST_URI")
                or environ.get("RAW_URI")
                or ""
            )
            if raw:
                parsed = urlsplit(raw)
                if parsed.path and parsed.path not in ("/api/index", "/api/index.py"):
                    environ["PATH_INFO"] = parsed.path
        return self.wsgi_app(environ, start_response)


if not isinstance(flask_app.wsgi_app, VercelPathMiddleware):
    flask_app.wsgi_app = VercelPathMiddleware(flask_app.wsgi_app)

app = flask_app
