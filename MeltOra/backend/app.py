import os
import json
import time
import re
import hmac
import hashlib
import base64
from datetime import datetime
from functools import wraps
from urllib.parse import quote
from flask import Flask, jsonify, request, send_from_directory
from pymongo.errors import PyMongoError

from db import get_db, get_next_order_id, ping_mongo, safe_init_db

# Static folder points to Vite production build
DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../my-react-app/dist"))
app = Flask(__name__, static_folder=DIST_DIR, static_url_path="/_flask_static")

# Admin Credentials & Token Signing
ADMIN_USERNAME = os.environ.get("MELTORA_ADMIN_USER", "biman")
ADMIN_PASSWORD_HASH = hashlib.sha256(
    os.environ.get("MELTORA_ADMIN_PASS", "12biman345").encode("utf-8")
).hexdigest()
ADMIN_SECRET = os.environ.get("MELTORA_ADMIN_SECRET", "meltora-br-admin-signing-key-2026")
TOKEN_TTL_SECONDS = 60 * 60 * 24  # 24 hours


def create_admin_token(username: str) -> str:
    exp = int(time.time()) + TOKEN_TTL_SECONDS
    payload = f"{username}:{exp}".encode("utf-8")
    sig = hmac.new(ADMIN_SECRET.encode("utf-8"), payload, hashlib.sha256).hexdigest()
    raw = f"{username}:{exp}:{sig}".encode("utf-8")
    return base64.urlsafe_b64encode(raw).decode("ascii")


def verify_admin_token(token: str) -> str | None:
    if not token:
        return None
    try:
        decoded = base64.urlsafe_b64decode(token.encode("ascii")).decode("utf-8")
        username, exp_str, sig = decoded.split(":", 2)
        if int(exp_str) < int(time.time()):
            return None
        payload = f"{username}:{exp_str}".encode("utf-8")
        expected_sig = hmac.new(ADMIN_SECRET.encode("utf-8"), payload, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        if not hmac.compare_digest(username, ADMIN_USERNAME):
            return None
        return username
    except Exception:
        return None


def get_bearer_token() -> str:
    auth = request.headers.get("Authorization", "")
    if auth.lower().startswith("bearer "):
        return auth[7:].strip()
    return ""


def require_admin(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if request.method == "OPTIONS":
            return jsonify({"status": "ok"})
        user = verify_admin_token(get_bearer_token())
        if not user:
            return jsonify({"success": False, "error": "Unauthorized admin access"}), 401
        return fn(*args, **kwargs)
    return wrapper


def mongo_unavailable(err):
    return jsonify({
        "success": False,
        "status": "disconnected",
        "error": f"MongoDB connection error: {err}. Configure MONGO_URI in backend/.env.",
    }), 503


# CORS: Enable cross-origin requests for all endpoints
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response


def format_product(doc):
    return {
        "id": doc.get("id", ""),
        "category": doc.get("category", "chocolate"),
        "line1": doc.get("line1", ""),
        "line2": doc.get("line2", ""),
        "full_name": doc.get("full_name", ""),
        "fullName": doc.get("full_name", ""),
        "price": doc.get("price", 0),
        "image_url": doc.get("image_url", ""),
        "imageUrl": doc.get("image_url", ""),
        "weight": doc.get("weight", ""),
        "description": doc.get("description", ""),
    }


# ============================================================
# API 0: Health & Admin Authentication
# ============================================================
@app.route("/api/health", methods=["GET"])
def api_health():
    ok, err = ping_mongo()
    if ok:
        return jsonify({"status": "ok", "database": "mongodb", "connected": True})
    return jsonify({"status": "degraded", "database": "mongodb", "connected": False, "error": err}), 503


@app.route("/api/admin/login", methods=["POST", "OPTIONS"])
def api_admin_login():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"})

    data = request.get_json(silent=True) or {}
    username = str(data.get("username") or "").strip()
    password = str(data.get("password") or "")

    pass_hash = hashlib.sha256(password.encode("utf-8")).hexdigest()
    user_ok = hmac.compare_digest(username, ADMIN_USERNAME)
    pass_ok = hmac.compare_digest(pass_hash, ADMIN_PASSWORD_HASH)

    if not (user_ok and pass_ok):
        return jsonify({"success": False, "error": "Invalid User ID or Password."}), 401

    token = create_admin_token(username)
    return jsonify({"success": True, "token": token, "username": username})


@app.route("/api/admin/verify", methods=["GET"])
@require_admin
def api_admin_verify():
    return jsonify({"authenticated": True, "username": ADMIN_USERNAME})


# ============================================================
# API 1: GET /api/home-data (Products, Hero Slides & Settings)
# ============================================================
@app.route("/api/home-data", methods=["GET"])
def api_home_data():
    try:
        db = get_db()
        chocolates_raw = list(db.products.find({"category": "chocolate"}, {"_id": 0}).sort("sort_order", 1))
        ghees_raw = list(db.products.find({"category": "ghee"}, {"_id": 0}).sort("sort_order", 1))
        settings_rows = list(db.settings.find({}, {"_id": 0}))
    except PyMongoError as exc:
        return mongo_unavailable(exc)

    chocolates = [format_product(r) for r in chocolates_raw]
    ghees = [format_product(r) for r in ghees_raw]
    config = {row["key"]: row["value"] for row in settings_rows if "key" in row}

    hero_slides = None
    if "heroSlides" in config:
        val = config["heroSlides"]
        if isinstance(val, list):
            hero_slides = val
        elif isinstance(val, str):
            try:
                hero_slides = json.loads(val)
            except Exception:
                pass

    return jsonify({
        "status": "connected",
        "database": "mongodb",
        "chocolates": chocolates,
        "ghees": ghees,
        "config": config,
        "heroSlides": hero_slides,
        "heroAnimation": config.get("heroAnimation", "slide"),
    })


# ============================================================
# API 2: POST /api/products (Add New Chocolate or Desi Ghee)
# ============================================================
@app.route("/api/products", methods=["POST", "OPTIONS"])
@require_admin
def api_add_product():
    data = request.get_json(silent=True) or {}
    category = data.get("category", "chocolate").strip().lower()
    if category not in ["chocolate", "ghee"]:
        category = "chocolate"

    line1 = (data.get("line1") or "Meltora").strip()
    line2 = (data.get("line2") or "Special Edition").strip()
    full_name = (data.get("fullName") or data.get("full_name") or f"{line1} {line2}").strip()
    image_url = (data.get("imageUrl") or data.get("image_url") or "").strip()
    weight = (data.get("weight") or ("500ml Jar" if category == "ghee" else "150g Pack")).strip()
    description = (
        data.get("description")
        or (
            "Pure traditional Bilona desi ghee crafted for authentic aroma and daily wellness."
            if category == "ghee"
            else "Crafted rich chocolate made with fine cocoa for smooth melt-in-mouth indulgence."
        )
    ).strip()

    try:
        price = max(1, int(data.get("price") or 100))
    except (ValueError, TypeError):
        price = 100

    slug = re.sub(r"[^a-zA-Z0-9]+", "-", full_name.lower()).strip("-")
    timestamp_suffix = int(time.time() * 1000) % 100000
    prod_id = f"{slug}-{timestamp_suffix}" if slug else f"item-{timestamp_suffix}"

    doc = {
        "id": prod_id,
        "category": category,
        "line1": line1,
        "line2": line2,
        "full_name": full_name,
        "price": price,
        "image_url": image_url,
        "weight": weight,
        "description": description,
        "sort_order": int(time.time() * 1000),
    }

    try:
        db = get_db()
        db.products.insert_one(doc)
    except PyMongoError as exc:
        return mongo_unavailable(exc)

    return jsonify({"success": True, "product": format_product(doc)})


# ============================================================
# API 3: DELETE /api/products/<product_id> (Remove Product)
# ============================================================
@app.route("/api/products/<product_id>", methods=["DELETE", "OPTIONS"])
@require_admin
def api_delete_product(product_id):
    try:
        db = get_db()
        res = db.products.delete_one({"id": product_id})
    except PyMongoError as exc:
        return mongo_unavailable(exc)

    return jsonify({"success": res.deleted_count > 0, "deletedId": product_id})


# ============================================================
# API 4: POST /api/hero-slides (Save Custom Hero Banner Config)
# ============================================================
@app.route("/api/hero-slides", methods=["POST", "OPTIONS"])
@require_admin
def api_save_hero_slides():
    data = request.get_json(silent=True) or {}
    slides = data.get("slides")
    animation = data.get("animation")

    try:
        db = get_db()
        if slides is not None:
            db.settings.update_one(
                {"key": "heroSlides"},
                {"$set": {"key": "heroSlides", "value": json.dumps(slides)}},
                upsert=True,
            )
        if animation:
            db.settings.update_one(
                {"key": "heroAnimation"},
                {"$set": {"key": "heroAnimation", "value": str(animation)}},
                upsert=True,
            )
    except PyMongoError as exc:
        return mongo_unavailable(exc)

    return jsonify({"success": True})


# ============================================================
# API 4B: POST /api/settings (Update WhatsApp & Call Settings)
# ============================================================
@app.route("/api/settings", methods=["POST", "OPTIONS"])
@require_admin
def api_save_settings():
    data = request.get_json(silent=True) or {}
    allowed_keys = [
        "chocolateWhatsappNumber",
        "gheeWhatsappNumber",
        "whatsappRoutingMode",
        "whatsappGroupLink",
        "callNumber",
        "callDisplay",
    ]

    updated = {}
    try:
        db = get_db()
        for key in allowed_keys:
            if key in data and data[key] is not None:
                val = str(data[key]).strip()
                db.settings.update_one(
                    {"key": key},
                    {"$set": {"key": key, "value": val}},
                    upsert=True,
                )
                updated[key] = val
    except PyMongoError as exc:
        return mongo_unavailable(exc)

    return jsonify({"success": True, "config": updated})


# ============================================================
# API 5: POST /api/orders (Create New Order)
# ============================================================
@app.route("/api/orders", methods=["POST", "OPTIONS"])
def api_create_order():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"})

    data = request.get_json(silent=True) or {}
    customer_name = (data.get("customerName") or data.get("customer_name") or "Direct Scan Visitor").strip()
    product_name = (data.get("productName") or data.get("product_name") or "Meltora Combo / Custom Order").strip()
    category = (data.get("category") or "chocolate").strip().lower()
    try:
        quantity = max(1, int(data.get("quantity") or 1))
    except (ValueError, TypeError):
        quantity = 1

    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    try:
        db = get_db()
        row_id = get_next_order_id(db)
        order_code = f"MLT-{1000 + row_id}"
        order_doc = {
            "id": row_id,
            "order_code": order_code,
            "customer_name": customer_name,
            "product_name": product_name,
            "category": category,
            "quantity": quantity,
            "created_at": created_at,
        }
        db.orders.insert_one(order_doc)
        settings_rows = list(db.settings.find({}, {"_id": 0}))
    except PyMongoError as exc:
        return mongo_unavailable(exc)

    config = {r["key"]: r["value"] for r in settings_rows if "key" in r}
    wa_link = config.get("whatsappGroupLink", "https://chat.whatsapp.com/")
    routing_mode = config.get("whatsappRoutingMode", "category")
    raw_num = (
        config.get("gheeWhatsappNumber", "919876543211")
        if category == "ghee"
        else config.get("chocolateWhatsappNumber", "919876543210")
    )
    digits = re.sub(r"[^0-9]", "", raw_num)

    order_text = (
        f"Hello Meltora! Order ID: {order_code} | "
        f"Item: {product_name} (Qty: {quantity}) | Name: {customer_name}"
    )
    whatsapp_url = (
        wa_link
        if routing_mode == "group" or not digits
        else f"https://wa.me/{digits}?text={quote(order_text)}"
    )

    return jsonify({
        "success": True,
        "orderCode": order_code,
        "orderText": order_text,
        "whatsappUrl": whatsapp_url,
        "whatsappGroupLink": wa_link,
        "order": {
            "id": row_id,
            "orderCode": order_code,
            "customerName": customer_name,
            "productName": product_name,
            "quantity": quantity,
            "createdAt": created_at,
        },
    })


# ============================================================
# API 6: GET /api/orders (List all orders from MongoDB)
# ============================================================
@app.route("/api/orders", methods=["GET"])
@require_admin
def api_list_orders():
    try:
        db = get_db()
        rows = list(db.orders.find({}, {"_id": 0}).sort("id", -1))
    except PyMongoError as exc:
        return mongo_unavailable(exc)

    formatted_orders = []
    for r in rows:
        formatted_orders.append({
            "id": r.get("id"),
            "order_code": r.get("order_code"),
            "orderCode": r.get("order_code"),
            "customer_name": r.get("customer_name"),
            "customerName": r.get("customer_name"),
            "product_name": r.get("product_name"),
            "productName": r.get("product_name"),
            "quantity": r.get("quantity", 1),
            "created_at": r.get("created_at"),
            "createdAt": r.get("created_at"),
        })

    return jsonify({
        "total_orders": len(formatted_orders),
        "orders": formatted_orders,
    })


# ============================================================
# API 7: DELETE /api/orders/<order_id> & DELETE /api/orders
# ============================================================
@app.route("/api/orders/<int:order_id>", methods=["DELETE", "OPTIONS"])
@require_admin
def api_delete_order(order_id):
    try:
        db = get_db()
        res = db.orders.delete_one({"id": order_id})
    except PyMongoError as exc:
        return mongo_unavailable(exc)

    return jsonify({"success": res.deleted_count > 0, "deletedId": order_id})


@app.route("/api/orders", methods=["DELETE", "OPTIONS"])
@require_admin
def api_clear_orders():
    try:
        db = get_db()
        res = db.orders.delete_many({})
    except PyMongoError as exc:
        return mongo_unavailable(exc)

    return jsonify({"success": True, "deletedCount": res.deleted_count})


# ============================================================
# Production Static Serving (React Vite build)
# ============================================================
@app.route("/", defaults={"path": ""})
@app.route("/meltora-br-admin", defaults={"path": "meltora-br-admin"})
@app.route("/<path:path>")
def serve_frontend(path):
    target_path = os.path.join(app.static_folder, path)
    if path != "" and os.path.isfile(target_path):
        return send_from_directory(app.static_folder, path)
    if os.path.exists(os.path.join(app.static_folder, "index.html")):
        return send_from_directory(app.static_folder, "index.html")
    return jsonify({
        "message": "Meltora Flask + MongoDB Backend is Running!",
        "received_path": request.path,
        "api_endpoints": ["/api/health", "/api/home-data", "/api/orders", "/api/products", "/api/hero-slides"],
        "hint": "Run 'npm run build' in my-react-app or start Vite on port 5173.",
    })


safe_init_db()

if __name__ == "__main__":
    print(" * Meltora Backend (MongoDB) running on http://127.0.0.1:5000")
    print(f" * Serving Frontend from: {app.static_folder}")
    app.run(host="0.0.0.0", port=5000, debug=True)
