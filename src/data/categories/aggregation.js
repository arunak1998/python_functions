export default {
  id: "aggregation",
  number: "05",
  title: "Data Aggregation",
  verb: "Aggregate",
  lead: "Turn many rows into a few meaningful numbers: totals, averages and counts by group. This is where your raw data starts answering business questions.",
  functions: [
    {
      id: "sum_mean",
      name: "sum() / mean() / max()",
      signature: "s.sum()  ·  s.mean()  ·  s.median()  ·  s.min()  ·  s.max()",
      summary: "Calculates one summary number for a column.",
      explain: "These are the basic summary functions. Call them on a column to get one number, or on a DataFrame to get one number per column. Missing values are skipped automatically.",
      params: [
        ["numeric_only", "On a DataFrame, set True to skip text columns."],
        ["skipna", "Set False to return NaN if any value is missing."],
      ],
      tip: "df[['units', 'unit_price']].agg(['sum', 'mean', 'max']) gives several stats for several columns in one table.",
      mistake: "mean() on a text column raises a TypeError. Select numeric columns first.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

print("Total revenue:", df["revenue"].sum())
print("Average units:", round(df["units"].mean(), 2))
print("Biggest order:", df["revenue"].max())`,
    },
    {
      id: "count_size",
      name: "count() / size()",
      signature: "df.count()  ·  df.groupby(col).size()",
      summary: "Counts rows, either non-blank values or all of them.",
      explain: "count() skips missing values, so it shows how many real values each column has. size() counts every row in a group, including blanks.",
      params: [
        ["count()", "Number of non-missing values."],
        ["size()", "Total rows, blanks included."],
      ],
      tip: "groupby(...).size().sort_values(ascending=False) shows your busiest groups.",
      mistake: "count() and size() differ only when there are blanks, so don't swap them without thinking.",
      code: `import pandas as pd

df = pd.read_csv("messy.csv")
print("count() per column:")
print(df.count())
print()
print("size() by city:")
df.groupby(df["city"].str.strip().str.title()).size()`,
    },
    {
      id: "groupby",
      name: "df.groupby()",
      signature: "df.groupby(by)[col].agg_func()",
      summary: "Splits rows into groups and summarizes each group.",
      explain: "This is the most important aggregation function. Read it as 'for each region, total the revenue'. pandas splits the rows by group, applies the calculation, and combines the results.",
      params: [
        ["by", "A column, or a list of columns, to group by."],
        ["as_index", "False keeps the group names as a normal column. That works well for charts and merges."],
      ],
      tip: "Group by a list for 2 levels, e.g. df.groupby(['region', 'category'])['revenue'].sum().",
      mistake: "Without selecting a column ([col]), groupby tries to total every column, including text.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

(df.groupby("region", as_index=False)["revenue"]
   .sum()
   .sort_values("revenue", ascending=False))`,
    },
    {
      id: "agg",
      name: "groupby().agg()",
      signature: "df.groupby(col).agg(new_name=(col, 'func'), ...)",
      summary: "Calculates several statistics for each group at once.",
      explain: "Named aggregation lets you choose the output column name, the input column and the function in one readable line. You get a clean summary table in a single step.",
      params: [["new_name=(column, func)", "func can be 'sum', 'mean', 'count', 'nunique', 'max' or your own function."]],
      tip: "Named aggregation like total=('revenue', 'sum') avoids confusing two-level column headers.",
      mistake: "Passing a plain dict with lists creates two-level column names that are hard to work with. Use named aggregation instead.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

df.groupby("category").agg(
    orders=("order_id", "count"),
    total_units=("units", "sum"),
    avg_revenue=("revenue", "mean"),
    products=("product", "nunique"),
).round(0)`,
    },
    {
      id: "pivot_table",
      name: "pd.pivot_table()",
      signature: "df.pivot_table(values, index, columns, aggfunc='mean', fill_value=None)",
      summary: "Builds an Excel-style pivot table.",
      explain: "Groups by two things at once, with one on the rows and one on the columns, and summarizes a value at each crossing. It works exactly like a pivot table in Excel.",
      params: [
        ["values", "The column to summarize."],
        ["index / columns", "What goes down the side and what goes across the top."],
        ["aggfunc", "'sum', 'mean', 'count' and so on. The default is mean."],
        ["margins", "True adds an 'All' total row and column."],
      ],
      tip: "fill_value=0 replaces empty cells, and margins=True adds the grand totals.",
      mistake: "The default aggfunc is mean, not sum. Pass aggfunc='sum' for totals.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

df.pivot_table(
    values="revenue",
    index="region",
    columns="category",
    aggfunc="sum",
    fill_value=0,
    margins=True,
)`,
    },
    {
      id: "crosstab",
      name: "pd.crosstab()",
      signature: "pd.crosstab(index, columns, normalize=False)",
      summary: "Counts how often two categories occur together.",
      explain: "This is a frequency table. For example, it shows how many orders each region placed in each category. It's a shortcut for pivot_table when you only need counts.",
      params: [
        ["index / columns", "Two columns (Series) to compare."],
        ["normalize", "'index' gives row percentages, 'columns' gives column percentages and True gives the overall share."],
      ],
      tip: "normalize='index' answers 'what share of each region's orders is Furniture?'",
      mistake: "Pass columns (df['col']), not column names as strings.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
print(pd.crosstab(df["region"], df["category"]))
print()
pd.crosstab(df["region"], df["category"], normalize="index").round(2)`,
    },
    {
      id: "transform",
      name: "groupby().transform()",
      signature: "df.groupby(col)[val].transform('sum')",
      summary: "Puts each group's total back on every row.",
      explain: "agg shrinks each group to one row, while transform keeps every row. Use it for things like 'what share of its region's revenue is this order?'.",
      params: [["func", "'sum', 'mean', 'max', 'rank' or your own function."]],
      tip: "This is the standard way to calculate percent of group: df['val'] / df.groupby('g')['val'].transform('sum').",
      mistake: "Using agg here gives one row per group, which no longer lines up with the original rows.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

df["region_total"] = df.groupby("region")["revenue"].transform("sum")
df["share_pct"] = (df["revenue"] / df["region_total"] * 100).round(1)

df[["region", "product", "revenue", "region_total", "share_pct"]].head()`,
    },
    {
      id: "resample",
      name: "df.resample()",
      signature: "df.resample(rule, on=date_col).agg_func()",
      summary: "Groups rows by time period: day, week, month or quarter.",
      explain: "This is groupby for dates. Choose a period such as 'W' for weekly, 'ME' for month end or 'QE' for quarter end, and pandas puts each row into its period for you.",
      params: [
        ["rule", "'D' day, 'W' week, 'ME' month end, 'QE' quarter end, 'YE' year end."],
        ["on", "The date column, if it isn't the index."],
      ],
      tip: "Periods with no rows still appear (as 0 or NaN), which is good for showing gaps in a chart.",
      mistake: "The date column must be a real datetime. Convert it with pd.to_datetime or parse_dates first.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv", parse_dates=["order_date"])
df["revenue"] = df["units"] * df["unit_price"]

monthly = df.resample("ME", on="order_date")["revenue"].sum()
monthly`,
    },
  ],
};
