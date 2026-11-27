export default {
  id: "analysis",
  number: "06",
  title: "Data Analysis",
  verb: "Analyze",
  lead: "Ask questions and find patterns: filter the rows that matter, rank them, measure relationships and track change over time.",
  functions: [
    {
      id: "filter",
      name: "Boolean filtering",
      signature: "df[df['col'] > value]  ·  df[(cond1) & (cond2)]  ·  s.isin([...])",
      summary: "Keeps only the rows that match a condition.",
      explain: "A condition like df['units'] > 5 makes a True/False Series. Putting it inside df[...] keeps the True rows. Combine conditions with & (and), | (or) and ~ (not).",
      params: [
        ["& | ~", "And, or, not. Wrap every condition in brackets."],
        ["isin(list)", "Keeps rows whose value is in the list."],
        ["between(a, b)", "Keeps values in a range, inclusive."],
      ],
      tip: "Name your conditions (is_east = df['region'] == 'East') to keep long filters readable.",
      mistake: "df[df.a > 1 and df.b < 5] fails. Use & and brackets: df[(df.a > 1) & (df.b < 5)].",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")

is_electronics = df["category"] == "Electronics"
is_big_region = df["region"].isin(["South", "East"])

df[is_electronics & is_big_region & (df["units"] >= 5)]`,
    },
    {
      id: "query",
      name: "df.query()",
      signature: "df.query('col > 5 and other == \"x\"')",
      summary: "Filters rows using a readable text expression.",
      explain: "It's the same as boolean filtering, but you write the condition as a string with plain and/or. Refer to Python variables with @name.",
      params: [
        ["expr", "Condition string. Column names are used directly."],
        ["@variable", "Use a Python variable inside the query."],
      ],
      tip: "Column names with spaces need backticks inside the query: `unit price` > 100.",
      mistake: "Forgetting the @ before a variable gives \"name 'x' is not defined\".",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
min_price = 5000

df.query("category == 'Furniture' and unit_price >= @min_price and units > 1")`,
    },
    {
      id: "nlargest",
      name: "nlargest() / nsmallest()",
      signature: "df.nlargest(n, columns)  ·  df.nsmallest(n, columns)",
      summary: "Gets the top or bottom n rows in one call.",
      explain: "This does sort_values plus head in one step, and it's faster on big data. It's perfect for top-10 lists.",
      params: [
        ["n", "How many rows."],
        ["columns", "The column to rank by."],
        ["keep", "Ties: 'first', 'last' or 'all'."],
      ],
      tip: "Combine with groupby to get the top item per group: df.groupby('region')['revenue'].nlargest(1).",
      mistake: "It only works on numeric columns. For text, use sort_values.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

df.nlargest(5, "revenue")[["order_id", "product", "region", "revenue"]]`,
    },
    {
      id: "corr",
      name: "df.corr()",
      signature: "df.corr(method='pearson', numeric_only=True)",
      summary: "Measures how strongly two numeric columns move together.",
      explain: "Gives a number from -1 to 1. Close to 1 means they rise together, close to -1 means one rises as the other falls, and near 0 means no clear link.",
      params: [
        ["method", "'pearson' for straight-line relationships, 'spearman' for rank order."],
        ["numeric_only", "True skips text columns. This is needed in pandas 2."],
      ],
      tip: "s1.corr(s2) gives just one number for two columns.",
      mistake: "Correlation doesn't prove one thing causes another, and it can miss curved relationships.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

df[["units", "unit_price", "revenue"]].corr().round(2)`,
    },
    {
      id: "quantile",
      name: "quantile()",
      signature: "s.quantile(q=0.5)  ·  s.quantile([0.25, 0.5, 0.75])",
      summary: "Finds the value below which a given share of the data falls.",
      explain: "quantile(0.9) is the value that 90% of rows fall below. Use it to set thresholds, such as top 10% of customers, or to find outliers with the IQR rule.",
      params: [["q", "A number from 0 to 1, or a list of them."]],
      tip: "Outlier rule: anything above Q3 + 1.5 × (Q3 − Q1) is unusually large.",
      mistake: "quantile takes a fraction: 90th percentile is quantile(0.9), not quantile(90).",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

q1, q3 = df["revenue"].quantile([0.25, 0.75])
limit = q3 + 1.5 * (q3 - q1)

print(f"Q1={q1:.0f}  Q3={q3:.0f}  outlier above {limit:.0f}")
df[df["revenue"] > limit][["product", "units", "revenue"]]`,
    },
    {
      id: "rolling",
      name: "rolling()",
      signature: "s.rolling(window).mean()",
      summary: "Calculates a moving average or moving sum over a window.",
      explain: "Smooths out ups and downs so the trend is clearer. A 3-month rolling mean averages each month with the two months before it.",
      params: [
        ["window", "Number of rows in each window."],
        ["min_periods", "Allow a result with fewer rows at the start instead of NaN."],
      ],
      tip: "Sort by date first. A rolling window just uses whatever rows are next to each other.",
      mistake: "The first window-1 rows are NaN. That's expected. Use min_periods=1 if you want values there.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv", parse_dates=["order_date"])
df["revenue"] = df["units"] * df["unit_price"]

monthly = df.resample("ME", on="order_date")["revenue"].sum().to_frame()
monthly["avg_3m"] = monthly["revenue"].rolling(3).mean().round(0)
monthly`,
    },
    {
      id: "pct_change",
      name: "pct_change() / diff()",
      signature: "s.pct_change()  ·  s.diff()",
      summary: "Shows how much each value changed from the previous one.",
      explain: "diff() gives the change in raw units, and pct_change() gives it as a fraction. Use them for month-over-month growth, daily returns and similar questions.",
      params: [["periods", "How many rows back to compare, e.g. 12 for the same month last year."]],
      tip: "Multiply by 100 and round: s.pct_change().mul(100).round(1) for readable percentages.",
      mistake: "The first row is always NaN because it has nothing before it to compare with.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv", parse_dates=["order_date"])
df["revenue"] = df["units"] * df["unit_price"]

monthly = df.resample("ME", on="order_date")["revenue"].sum().to_frame()
monthly["change"] = monthly["revenue"].diff()
monthly["growth_%"] = monthly["revenue"].pct_change().mul(100).round(1)
monthly`,
    },
    {
      id: "rank",
      name: "rank()",
      signature: "s.rank(ascending=True, method='average')",
      summary: "Gives each value its position: 1st, 2nd, 3rd…",
      explain: "Unlike sorting, rank keeps rows where they are and adds the position as a number. Use it with groupby to rank within each group.",
      params: [
        ["ascending", "False means the biggest value gets rank 1."],
        ["method", "How to handle ties: 'average', 'min', 'dense' (no gaps) or 'first'."],
      ],
      tip: "groupby('region')['revenue'].rank(ascending=False) ranks each order within its own region.",
      mistake: "The default ranks smallest = 1. For leaderboards, pass ascending=False.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

df["rank_in_region"] = (
    df.groupby("region")["revenue"].rank(ascending=False, method="dense").astype(int)
)
df[df["rank_in_region"] == 1][["region", "product", "revenue"]]`,
    },
  ],
};
