import os
from dotenv import load_dotenv
from pymongo import MongoClient, ReturnDocument
from pymongo.errors import PyMongoError

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))


def _clean_env(val: str, default: str = "") -> str:
    cleaned = (val or default).strip()
    if len(cleaned) >= 2 and cleaned[0] == cleaned[-1] and cleaned[0] in ('"', "'"):
        cleaned = cleaned[1:-1].strip()
    return cleaned


MONGO_URI = _clean_env(
    os.environ.get("MONGODB_URI") or os.environ.get("MONGO_URI"),
    "mongodb://127.0.0.1:27017",
)
MONGO_DB_NAME = _clean_env(os.environ.get("MONGO_DB_NAME"), "meltora") or "meltora"

DEFAULT_SETTINGS = {
    "chocolateWhatsappNumber": "919876543210",
    "gheeWhatsappNumber": "919876543211",
    "whatsappRoutingMode": "category",
    "whatsappGroupLink": "https://chat.whatsapp.com/YOUR_GROUP_INVITE_CODE",
    "callNumber": "+919876543210",
    "callDisplay": "+91 98765 43210",
    "heroAnimation": "slide",
}

DEFAULT_PRODUCTS = [
    {
        "id": "cadbury",
        "category": "chocolate",
        "line1": "Cadbury",
        "line2": "Dairy Milk",
        "full_name": "Cadbury Dairy Milk",
        "price": 80,
        "image_url": "",
        "weight": "150g Pack",
        "description": "Smooth & creamy milk chocolate crafted for everyday celebrations and gifting.",
    },
    {
        "id": "amul-choco",
        "category": "chocolate",
        "line1": "Amul",
        "line2": "Chocolate",
        "full_name": "Amul Dark Chocolate",
        "price": 110,
        "image_url": "",
        "weight": "150g Bar",
        "description": "Rich 55% dark cocoa bar made from finest roasted cocoa beans with velvety finish.",
    },
    {
        "id": "nestle",
        "category": "chocolate",
        "line1": "Nestlé",
        "line2": "Classic",
        "full_name": "Nestlé Classic",
        "price": 50,
        "image_url": "",
        "weight": "120g Bar",
        "description": "Classic melt-in-mouth milk chocolate bar loved across generations.",
    },
    {
        "id": "hersheys",
        "category": "chocolate",
        "line1": "Hershey's",
        "line2": "Chocolate",
        "full_name": "Hershey's Milk Chocolate",
        "price": 120,
        "image_url": "",
        "weight": "100g Bar",
        "description": "Signature creamy milk chocolate with rich caramelized cocoa notes.",
    },
    {
        "id": "meltora-ghee",
        "category": "ghee",
        "line1": "Meltora",
        "line2": "Desi Ghee",
        "full_name": "Meltora Desi Ghee",
        "price": 650,
        "image_url": "",
        "weight": "500ml Glass Jar",
        "description": "100% pure traditional Bilona cow desi ghee with rich golden aroma & granular texture.",
    },
    {
        "id": "patanjali-ghee",
        "category": "ghee",
        "line1": "Patanjali",
        "line2": "Desi Ghee",
        "full_name": "Patanjali Desi Ghee",
        "price": 610,
        "image_url": "",
        "weight": "500ml Jar",
        "description": "Pure cow desi ghee prepared for daily nutrition, cooking, and festive sweets.",
    },
    {
        "id": "amul-ghee",
        "category": "ghee",
        "line1": "Amul",
        "line2": "Pure Ghee",
        "full_name": "Amul Pure Ghee",
        "price": 620,
        "image_url": "",
        "weight": "500ml Tin",
        "description": "Trusted pure dairy ghee rich in natural aroma and golden richness.",
    },
    {
        "id": "gowardhan-ghee",
        "category": "ghee",
        "line1": "Gowardhan",
        "line2": "Desi Ghee",
        "full_name": "Gowardhan Desi Ghee",
        "price": 640,
        "image_url": "",
        "weight": "500ml Jar",
        "description": "Traditional cow milk ghee crafted for authentic home-style taste.",
    },
]

_client = None
_db_override = None


def set_db_override(db):
    """Allows tests or custom setups to inject a MongoDB database instance."""
    global _db_override
    _db_override = db


def get_mongo_client():
    global _client
    if _client is None:
        uri = _clean_env(
            os.environ.get("MONGODB_URI") or os.environ.get("MONGO_URI"),
            MONGO_URI,
        )
        _client = MongoClient(uri, serverSelectionTimeoutMS=8000)
    return _client


def get_db():
    if _db_override is not None:
        return _db_override
    db_name = _clean_env(os.environ.get("MONGO_DB_NAME"), MONGO_DB_NAME) or "meltora"
    return get_mongo_client()[db_name]


def ping_mongo():
    try:
        db = get_db()
        db.command("ping")
        return True, None
    except Exception as exc:
        return False, str(exc)


def init_db():
    """Creates indexes and seeds default settings & products in MongoDB if empty."""
    db = get_db()
    db.products.create_index("id", unique=True)
    db.orders.create_index("id", unique=True)
    db.settings.create_index("key", unique=True)

    for key, value in DEFAULT_SETTINGS.items():
        db.settings.update_one(
            {"key": key},
            {"$setOnInsert": {"key": key, "value": value}},
            upsert=True,
        )

    if db.products.count_documents({}) == 0:
        for idx, prod in enumerate(DEFAULT_PRODUCTS):
            doc = {**prod, "sort_order": idx}
            db.products.update_one({"id": doc["id"]}, {"$setOnInsert": doc}, upsert=True)

    db.counters.update_one(
        {"_id": "order_seq"},
        {"$setOnInsert": {"_id": "order_seq", "seq": 0}},
        upsert=True,
    )


def get_next_order_id(db=None):
    target = db if db is not None else get_db()
    res = target.counters.find_one_and_update(
        {"_id": "order_seq"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return int(res["seq"])


def safe_init_db():
    try:
        init_db()
        return True
    except PyMongoError as exc:
        print(f" * [MeltOra] MongoDB not ready yet ({exc}). Set MONGO_URI in backend/.env")
        return False
    except Exception as exc:
        print(f" * [MeltOra] MongoDB init skipped ({exc}).")
        return False
