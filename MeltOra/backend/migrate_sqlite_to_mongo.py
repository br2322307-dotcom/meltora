"""
One-time helper script to migrate existing data from local SQLite (meltora.db)
into MongoDB (configured via backend/.env MONGO_URI).
"""
import os
import sqlite3
from db import get_db, init_db

SQLITE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "meltora.db")


def migrate():
    if not os.path.exists(SQLITE_PATH):
        print("No local meltora.db found; initializing fresh MongoDB collections.")
        init_db()
        return

    init_db()
    mongo = get_db()
    conn = sqlite3.connect(SQLITE_PATH)
    conn.row_factory = sqlite3.Row

    # 1. Migrate Products
    products = conn.execute("SELECT * FROM products ORDER BY rowid ASC").fetchall()
    for idx, row in enumerate(products):
        doc = {
            "id": row["id"],
            "category": row["category"],
            "line1": row["line1"],
            "line2": row["line2"],
            "full_name": row["full_name"],
            "price": row["price"],
            "image_url": row["image_url"] or "",
            "weight": row["weight"] if "weight" in row.keys() else "",
            "description": row["description"] if "description" in row.keys() else "",
            "sort_order": idx,
        }
        mongo.products.update_one({"id": doc["id"]}, {"$set": doc}, upsert=True)

    # 2. Migrate Settings
    settings = conn.execute("SELECT key, value FROM settings").fetchall()
    for row in settings:
        mongo.settings.update_one(
            {"key": row["key"]},
            {"$set": {"key": row["key"], "value": row["value"]}},
            upsert=True,
        )

    # 3. Migrate Orders
    orders = conn.execute("SELECT * FROM orders ORDER BY id ASC").fetchall()
    max_id = 0
    for row in orders:
        oid = int(row["id"])
        max_id = max(max_id, oid)
        doc = {
            "id": oid,
            "order_code": row["order_code"],
            "customer_name": row["customer_name"],
            "product_name": row["product_name"],
            "category": "chocolate",
            "quantity": int(row["quantity"]),
            "created_at": row["created_at"],
        }
        mongo.orders.update_one({"id": oid}, {"$set": doc}, upsert=True)

    if max_id > 0:
        mongo.counters.update_one(
            {"_id": "order_seq"},
            {"$max": {"seq": max_id}},
            upsert=True,
        )

    conn.close()
    print(f"Migrated {len(products)} products, {len(settings)} settings, {len(orders)} orders to MongoDB!")


if __name__ == "__main__":
    migrate()
