// Practice files loaded into the in-browser Python. Source: scripts/make_data.py
export default [
  { file: "sales.csv", rows: "40 orders", about: "Jan–Jun 2024 orders", columns: "order_id, order_date, region, product, category, units, unit_price, customer_id" },
  { file: "customers.csv", rows: "8 customers", about: "Lookup table for merges", columns: "customer_id, name, city, segment" },
  { file: "messy.csv", rows: "9 rows", about: "Blanks, a duplicate, extra spaces, mixed capitals", columns: "customer, age, city, phone, joined, spend" },
  { file: "sales.xlsx", rows: "2 sheets", about: "orders + customers", columns: "Same columns as the CSVs" },
  { file: "sales.json", rows: "10 orders", about: "JSON records", columns: "Same columns as sales.csv" },
  { file: "shop.db", rows: "2 tables", about: "SQLite database", columns: "sales, customers" },
  { file: "targets.html", rows: "1 table", about: "Web page with a <table>", columns: "region, manager, target" },
];
