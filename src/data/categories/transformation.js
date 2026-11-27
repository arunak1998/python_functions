export default {
  id: "transformation",
  number: "04",
  title: "Data Transformation",
  verb: "Transform",
  lead: "Reshape the data into what your question needs: add new columns, convert values, sort, group numbers into bands, and combine tables.",
  functions: [
    {
      id: "new_column",
      name: "df['new'] = … / assign()",
      signature: "df['revenue'] = df['units'] * df['unit_price']  ·  df.assign(col=...)",
      summary: "Creates new columns from existing ones.",
      explain: "Maths on columns works row by row automatically, so you don't need a loop. assign() does the same thing but returns a new DataFrame, which makes it good for chaining.",
      params: [
        ["df['col'] = ...", "Adds the column to df directly."],
        ["assign(name=...)", "Returns a copy with the new column. Use a lambda to refer to the current table."],
      ],
      tip: "Column maths is vectorized, which makes it about 100x faster than a for loop or apply.",
      mistake: "Using Python's and/or on columns. Use & and |, and wrap each condition in brackets.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]
df = df.assign(is_big=lambda d: d["revenue"] > 50000)

df[["product", "units", "unit_price", "revenue", "is_big"]].head()`,
    },
    {
      id: "apply",
      name: "df.apply()",
      signature: "s.apply(func)  ·  df.apply(func, axis=1)",
      summary: "Runs your own function on every value or every row.",
      explain: "When there's no built-in function for what you need, write a normal Python function and apply it. Use axis=1 when the logic needs several columns from the same row.",
      params: [
        ["func", "A function or lambda that receives one value (Series) or one row (axis=1)."],
        ["axis=1", "Pass rows to the function instead of columns."],
      ],
      tip: "Try a vectorized option first (np.where, maths, .str methods). apply is slower on big data.",
      mistake: "Forgetting axis=1 when your function reads row['col'] causes a KeyError.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")

def size_label(units):
    if units >= 8:
        return "bulk"
    if units >= 3:
        return "medium"
    return "single"

df["order_size"] = df["units"].apply(size_label)
df["label"] = df.apply(lambda row: f"{row['product']} x{row['units']}", axis=1)

df[["product", "units", "order_size", "label"]].head()`,
    },
    {
      id: "map",
      name: "s.map()",
      signature: "s.map(dict_or_function)",
      summary: "Translates each value using a dictionary.",
      explain: "Ideal for lookups: codes to names, names to groups, Yes/No to 1/0. Every value is looked up in the dict, and anything not in the dict becomes NaN.",
      params: [["arg", "A dict, a Series or a function."]],
      tip: "Add .fillna('Other') after map to catch values the dict doesn't cover.",
      mistake: "Values missing from the dict quietly become NaN. Check with .isna().sum() afterwards.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
zone = {"North": "N-Zone", "South": "S-Zone", "East": "E-Zone"}

df["zone"] = df["region"].map(zone).fillna("Other")
df[["region", "zone"]].drop_duplicates()`,
    },
    {
      id: "sort_values",
      name: "df.sort_values()",
      signature: "df.sort_values(by, ascending=True)  ·  df.sort_index()",
      summary: "Orders rows by one or more columns.",
      explain: "Sort to find the top or bottom rows or to put dates in order. Pass a list to sort by several columns, each in its own direction.",
      params: [
        ["by", "A column name, or a list of names."],
        ["ascending", "True or False, or a list with one value per column."],
      ],
      tip: "sort_values('revenue', ascending=False).head(5) gives your top 5. nlargest does it in one call.",
      mistake: "Sorting doesn't change df unless you assign it: df = df.sort_values(...).",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

df.sort_values(["region", "revenue"], ascending=[True, False]).head(6)`,
    },
    {
      id: "to_datetime",
      name: "pd.to_datetime() / .dt",
      signature: "pd.to_datetime(s, format=None, errors='raise')  ·  s.dt.month",
      summary: "Turns text into real dates and pulls out their parts.",
      explain: "Once a column is a real datetime, the .dt accessor gives you the year, month, day name and quarter, and you can do date maths. Most time analysis starts here.",
      params: [
        ["format", "Tell pandas the exact layout, e.g. '%d-%m-%Y'. It is faster and avoids mistakes."],
        ["errors='coerce'", "Invalid dates become NaT instead of crashing."],
      ],
      tip: "Useful .dt parts: .dt.year, .dt.month_name(), .dt.day_name(), .dt.quarter, .dt.to_period('M').",
      mistake: "Ambiguous dates like 03/04/2024 might be read as March 4. Pass format= or dayfirst=True.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["order_date"] = pd.to_datetime(df["order_date"])

df["month"] = df["order_date"].dt.month_name()
df["weekday"] = df["order_date"].dt.day_name()
df["days_since"] = (pd.Timestamp("2024-07-01") - df["order_date"]).dt.days

df[["order_date", "month", "weekday", "days_since"]].head()`,
    },
    {
      id: "cut",
      name: "pd.cut()",
      signature: "pd.cut(s, bins, labels=None)  ·  pd.qcut(s, q)",
      summary: "Groups numbers into labelled bands.",
      explain: "Turns a number into a category, such as price into 'Budget', 'Mid' or 'Premium', or age into age groups. cut uses edges you choose, while qcut makes groups with equal row counts.",
      params: [
        ["bins", "Edges such as [0, 2000, 10000, 100000]."],
        ["labels", "A name for each band. You need one fewer label than edges."],
      ],
      tip: "pd.qcut(s, 4, labels=['Q1','Q2','Q3','Q4']) splits into quartiles automatically.",
      mistake: "Values outside the edges become NaN. Make sure your first and last edges cover everything.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["price_band"] = pd.cut(
    df["unit_price"],
    bins=[0, 2000, 10000, 100000],
    labels=["Budget", "Mid", "Premium"],
)
df["price_band"].value_counts()`,
    },
    {
      id: "merge",
      name: "pd.merge()",
      signature: "pd.merge(left, right, on=None, how='inner')",
      summary: "Joins two tables on a shared key, like a SQL JOIN.",
      explain: "Brings in columns from another table by matching a key, for example adding customer names to each order. how decides what happens to rows that don't match.",
      params: [
        ["on", "The key column found in both tables."],
        ["how", "'inner' keeps only matches. 'left' keeps every left row. 'outer' keeps everything."],
        ["left_on / right_on", "Use these when the key columns have different names."],
        ["indicator", "True adds a _merge column showing where each row came from."],
      ],
      tip: "Use how='left' plus indicator=True to find orders whose customer is missing.",
      mistake: "Duplicate keys in the right table multiply rows. Check right['key'].is_unique first.",
      code: `import pandas as pd

sales = pd.read_csv("sales.csv")
customers = pd.read_csv("customers.csv")

merged = pd.merge(sales, customers, on="customer_id", how="left", indicator=True)
print(merged["_merge"].value_counts())

merged[["order_id", "customer_id", "name", "city"]].head()`,
    },
    {
      id: "concat",
      name: "pd.concat()",
      signature: "pd.concat([df1, df2], axis=0, ignore_index=False)",
      summary: "Stacks tables on top of each other or side by side.",
      explain: "Use concat when you have the same kind of data split across files, like January and February sales, and want one table. It matches columns by name.",
      params: [
        ["objs", "A list of DataFrames."],
        ["axis", "0 stacks rows (the default). 1 places them side by side."],
        ["ignore_index", "True renumbers the rows 0, 1, 2, …"],
      ],
      tip: "To load a folder of CSVs: pd.concat([pd.read_csv(f) for f in files], ignore_index=True).",
      mistake: "Calling concat inside a loop is very slow. Collect the tables in a list and concat once at the end.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
jan = df[df["order_date"].str.startswith("2024-01")]
feb = df[df["order_date"].str.startswith("2024-02")]

both = pd.concat([jan, feb], ignore_index=True)
print(len(jan), "+", len(feb), "=", len(both))
both.tail(3)`,
    },
  ],
};
