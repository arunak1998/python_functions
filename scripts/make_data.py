"""Generate the practice datasets used by every example on the site.

Run once from the project root:  python3 scripts/make_data.py
Output goes to public/data/ and is loaded into the in-browser Python.
"""

import random
import sqlite3
from pathlib import Path

import pandas as pd

OUT = Path(__file__).resolve().parent.parent / "public" / "data"

PRODUCTS = {
    "Laptop": ("Electronics", 55000),
    "Monitor": ("Electronics", 12000),
    "Keyboard": ("Electronics", 1500),
    "Mouse": ("Electronics", 600),
    "Headphones": ("Electronics", 2500),
    "Chair": ("Furniture", 7000),
    "Desk": ("Furniture", 9500),
}
REGIONS = ["North", "South", "East", "West"]


def make_sales():
    rng = random.Random(42)
    dates = pd.date_range("2024-01-03", "2024-06-28", periods=40).normalize()
    rows = []
    for i, date in enumerate(dates, start=1):
        product = rng.choice(list(PRODUCTS))
        category, price = PRODUCTS[product]
        units = rng.randint(1, 3) if price > 5000 else rng.randint(2, 12)
        rows.append({
            "order_id": 1000 + i,
            "order_date": date.strftime("%Y-%m-%d"),
            "region": rng.choice(REGIONS),
            "product": product,
            "category": category,
            "units": units,
            "unit_price": price,
            "customer_id": f"C{rng.randint(1, 10):02d}",
        })
    return pd.DataFrame(rows)


def make_customers():
    return pd.DataFrame({
        "customer_id": [f"C{i:02d}" for i in range(1, 9)],
        "name": ["Arun", "Priya", "Meena", "Ravi", "Karthik", "Divya", "Suresh", "Anitha"],
        "city": ["Chennai", "Madurai", "Chennai", "Coimbatore", "Trichy", "Chennai", "Madurai", "Coimbatore"],
        "segment": ["Retail", "Business", "Retail", "Business", "Retail", "Retail", "Business", "Retail"],
    })


MESSY_CSV = """customer,age,city,phone,joined,spend
  Arun Kumar ,28,chennai,98400 12345,2024-01-05,1200
Priya,,Madurai,,2024-02-11,850
meena ,35,CHENNAI,99620 55555,2024-02-28,
Ravi,41,Coimbatore,90030 11111,2024-03-03,2300
Priya,,Madurai,,2024-02-11,850
Karthik,29, trichy,93450 22222,2024-03-19,640
Divya,unknown,Chennai,98840 33333,2024-04-02,1750
Suresh,52,Madurai,,2024-04-15,
Anitha,33,coimbatore,97890 44444,2024-05-01,990
"""

TABLES_HTML = """<html><body>
<h1>Store targets</h1>
<table>
  <thead><tr><th>region</th><th>manager</th><th>target</th></tr></thead>
  <tbody>
    <tr><td>North</td><td>Ravi</td><td>150000</td></tr>
    <tr><td>South</td><td>Meena</td><td>180000</td></tr>
    <tr><td>East</td><td>Karthik</td><td>120000</td></tr>
    <tr><td>West</td><td>Divya</td><td>140000</td></tr>
  </tbody>
</table>
</body></html>
"""


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    sales = make_sales()
    customers = make_customers()

    sales.to_csv(OUT / "sales.csv", index=False)
    customers.to_csv(OUT / "customers.csv", index=False)
    sales.head(10).to_json(OUT / "sales.json", orient="records", indent=2)
    (OUT / "messy.csv").write_text(MESSY_CSV)
    (OUT / "targets.html").write_text(TABLES_HTML)

    with pd.ExcelWriter(OUT / "sales.xlsx") as writer:
        sales.to_excel(writer, sheet_name="orders", index=False)
        customers.to_excel(writer, sheet_name="customers", index=False)

    db_path = OUT / "shop.db"
    db_path.unlink(missing_ok=True)
    with sqlite3.connect(db_path) as conn:
        sales.to_sql("sales", conn, index=False)
        customers.to_sql("customers", conn, index=False)

    print(f"Wrote {len(sales)} sales rows and {len(customers)} customers to {OUT}")


if __name__ == "__main__":
    main()
