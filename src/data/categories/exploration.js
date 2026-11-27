export default {
  id: "exploration",
  number: "02",
  title: "Data Exploration",
  verb: "Explore",
  lead: "Before changing anything, get to know your data: its size, its columns, their types and its values. Five minutes here saves hours of debugging later.",
  functions: [
    {
      id: "head_tail",
      name: "df.head() / df.tail()",
      signature: "df.head(n=5)  ·  df.tail(n=5)",
      summary: "Shows the first or last few rows.",
      explain: "This is the first thing to run after loading. It confirms the data loaded correctly and shows what the values look like.",
      params: [["n", "Number of rows to show. The default is 5."]],
      tip: "df.sample(5) picks 5 random rows. That is better than head() when the file is sorted.",
      mistake: "head() only shows rows. It doesn't change df, so there's no need to assign it back.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
print(df.tail(3))
df.head()`,
    },
    {
      id: "info",
      name: "df.info()",
      signature: "df.info()",
      summary: "Summarizes columns, types, non-null counts and memory.",
      explain: "One call tells you how many rows there are, each column's data type, and how many values are not empty. Missing values show up as a lower 'Non-Null Count'.",
      params: [["memory_usage", "Pass 'deep' for an accurate memory figure on text columns."]],
      tip: "If a number column shows as 'object', it contains some text, such as '1,200' or 'N/A'.",
      mistake: "info() prints the result and returns None, so don't write x = df.info().",
      code: `import pandas as pd

df = pd.read_csv("messy.csv")
df.info()`,
    },
    {
      id: "describe",
      name: "df.describe()",
      signature: "df.describe(include=None, percentiles=None)",
      summary: "Gives quick statistics for every numeric column.",
      explain: "Shows the count, mean, standard deviation, min, max and quartiles. It's the fastest way to spot strange values, like a negative price or an age of 300.",
      params: [
        ["include", "'all' adds text columns, showing count, unique, top and freq."],
        ["percentiles", "Extra percentiles to show, e.g. [0.1, 0.9]."],
      ],
      tip: "df.describe().T flips the table so each column becomes a row, which is easier to read when you have many columns.",
      mistake: "Text columns are skipped by default. Add include='all' to see them.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
df.describe().round(1)`,
    },
    {
      id: "shape_columns",
      name: "df.shape / df.columns",
      signature: "df.shape  ·  df.columns  ·  len(df)",
      summary: "Tells you the size of the table and its column names.",
      explain: "shape is a (rows, columns) tuple, and columns lists every column name. They are attributes, not functions, so you don't use brackets.",
      params: [
        ["df.shape[0]", "Number of rows, the same as len(df)."],
        ["df.shape[1]", "Number of columns."],
      ],
      tip: "Use df.columns.tolist() to get a plain list you can copy and paste.",
      mistake: "Writing df.shape() raises \"'tuple' object is not callable\". Leave out the ().",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
rows, cols = df.shape

print(f"{rows} rows x {cols} columns")
print(df.columns.tolist())`,
    },
    {
      id: "dtypes",
      name: "df.dtypes",
      signature: "df.dtypes  ·  df.select_dtypes(include='number')",
      summary: "Shows the data type of each column.",
      explain: "int64 and float64 are numbers, object usually means text, datetime64 means dates and bool means True/False. The wrong type is the most common hidden bug.",
      params: [["select_dtypes(include=...)", "Keep only columns of one type: 'number', 'object' or 'datetime'."]],
      tip: "Use df.select_dtypes('number').columns to list every numeric column for your analysis.",
      mistake: "Dates read from a CSV are text ('object') until you convert them with pd.to_datetime.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
print(df.dtypes)
print()
print("Numeric:", df.select_dtypes("number").columns.tolist())`,
    },
    {
      id: "loc_iloc",
      name: "df.loc[] / df.iloc[]",
      signature: "df.loc[rows, cols]  ·  df.iloc[row_pos, col_pos]",
      summary: "Selects rows and columns by label (loc) or by position (iloc).",
      explain: "loc uses names, such as index labels, column names or True/False conditions. iloc uses numbers, like a list. Both take [rows, columns].",
      params: [
        ["loc", "Label based. Slices include the end: loc[0:3] gives 4 rows."],
        ["iloc", "Position based. Slices exclude the end: iloc[0:3] gives 3 rows."],
      ],
      tip: "To change values, use df.loc[condition, 'col'] = value. This avoids the SettingWithCopyWarning.",
      mistake: "Mixing them up, e.g. iloc[:, 'units']. iloc only accepts numbers.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")

# loc: by label and condition
print(df.loc[df["region"] == "East", ["product", "units"]].head(3))
print()

# iloc: first 3 rows, first 4 columns
df.iloc[0:3, 0:4]`,
    },
    {
      id: "value_counts",
      name: "df['col'].value_counts()",
      signature: "s.value_counts(normalize=False, dropna=True)",
      summary: "Counts how many times each value appears.",
      explain: "This is the go-to tool for category columns. You see right away which values are common and which are rare, and you catch typos such as 'Chennai' vs 'chennai'.",
      params: [
        ["normalize", "True gives shares (0 to 1) instead of counts."],
        ["dropna", "False also counts missing values."],
      ],
      tip: "df['col'].value_counts(normalize=True).mul(100).round(1) gives clean percentages.",
      mistake: "Missing values are not counted unless you pass dropna=False.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
print(df["region"].value_counts())
print()
df["category"].value_counts(normalize=True).mul(100).round(1)`,
    },
    {
      id: "unique_nunique",
      name: "unique() / nunique()",
      signature: "s.unique()  ·  s.nunique()  ·  df.nunique()",
      summary: "Lists the distinct values, or counts them.",
      explain: "unique() returns every distinct value in a column, and nunique() says how many there are. Running df.nunique() on the whole table quickly shows which columns are IDs and which are categories.",
      params: [["dropna", "nunique(dropna=False) also counts NaN as a value."]],
      tip: "A column where nunique() equals len(df) is a unique ID, which is good to know before you merge.",
      mistake: "unique() returns a NumPy array, not a list. Call .tolist() if you need a list.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
print("Products:", df["product"].unique())
print()
df.nunique()`,
    },
  ],
};
