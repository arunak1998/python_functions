export default {
  id: "cleaning",
  number: "03",
  title: "Data Cleaning",
  verb: "Clean",
  lead: "Real data is messy: blanks, duplicates, extra spaces, mixed capital letters and numbers stored as text. These functions fix that. Every example here uses messy.csv.",
  functions: [
    {
      id: "isna",
      name: "df.isna().sum()",
      signature: "df.isna()  ·  df.isna().sum()  ·  df.notna()",
      summary: "Finds missing values (NaN) and counts them per column.",
      explain: "isna() marks every cell True when it is missing and False when it isn't. Adding .sum() counts the Trues in each column. Always run this before you clean.",
      params: [
        ["isna()", "True where the value is missing. isnull() is the same function."],
        ["notna()", "The opposite: True where the value is present."],
      ],
      tip: "df.isna().mean().mul(100).round(1) gives the percent missing per column.",
      mistake: "Never check df['col'] == None or == np.nan, because it is always False. Use isna().",
      code: `import pandas as pd

df = pd.read_csv("messy.csv")
print(df.isna().sum())
print()

# Show only the rows that have a gap somewhere
df[df.isna().any(axis=1)]`,
    },
    {
      id: "dropna",
      name: "df.dropna()",
      signature: "df.dropna(subset=None, how='any', thresh=None)",
      summary: "Removes rows (or columns) that have missing values.",
      explain: "The simplest fix for missing data is to drop it. Use subset to decide which columns matter, so a blank phone number doesn't remove an otherwise good row.",
      params: [
        ["subset", "Only look for blanks in these columns."],
        ["how", "'any' drops a row with at least one blank. 'all' drops it only if every value is blank."],
        ["thresh", "Keep rows that have at least this many non-blank values."],
      ],
      tip: "Check len(df) before and after dropping so you know how many rows you lost.",
      mistake: "dropna() on its own drops a row if any column is blank, and that can delete most of your data.",
      code: `import pandas as pd

df = pd.read_csv("messy.csv")
clean = df.dropna(subset=["spend"])

print(f"Before: {len(df)} rows, after: {len(clean)} rows")
clean`,
    },
    {
      id: "fillna",
      name: "df.fillna()",
      signature: "df.fillna(value)  ·  s.fillna(s.median())  ·  s.ffill()",
      summary: "Replaces missing values with something sensible.",
      explain: "Instead of deleting rows, fill the gaps. Use 0 for amounts, the median for numbers, 'Unknown' for text, or the previous value (ffill) for time series.",
      params: [
        ["value", "One value, or a dict like {'col': value} for different columns."],
        ["ffill() / bfill()", "Copy the previous or next value down or up into the gap."],
      ],
      tip: "A dict fills each column in one call: df.fillna({'spend': 0, 'phone': 'N/A'}).",
      mistake: "fillna returns a new DataFrame. Assign it back (df = df.fillna(...)) or nothing changes.",
      code: `import pandas as pd

df = pd.read_csv("messy.csv")

df = df.fillna({"spend": 0, "phone": "not given"})
df[["customer", "phone", "spend"]]`,
    },
    {
      id: "drop_duplicates",
      name: "df.drop_duplicates()",
      signature: "df.drop_duplicates(subset=None, keep='first')",
      summary: "Removes repeated rows.",
      explain: "A duplicate row counts twice in every total. drop_duplicates keeps the first copy and removes the rest. Use df.duplicated() first to see which rows are duplicates.",
      params: [
        ["subset", "Treat rows as duplicates when only these columns match."],
        ["keep", "'first', 'last', or False to drop every copy."],
      ],
      tip: "df.duplicated().sum() tells you how many duplicates exist before you remove them.",
      mistake: "By default, rows count as duplicates only if every column matches. Use subset for ID-based checks.",
      code: `import pandas as pd

df = pd.read_csv("messy.csv")
print("Duplicates found:", df.duplicated().sum())

df = df.drop_duplicates()
print("Rows left:", len(df))`,
    },
    {
      id: "str_methods",
      name: "s.str.strip() / .str.title()",
      signature: "s.str.strip()  ·  s.str.lower()  ·  s.str.title()  ·  s.str.contains()",
      summary: "Cleans text: spaces, capital letters, patterns.",
      explain: "The .str accessor applies a string method to every value in a column at once. 'chennai', 'CHENNAI' and ' Chennai ' become one value, 'Chennai'.",
      params: [
        ["strip()", "Removes spaces at the start and end."],
        ["lower() / upper() / title()", "Changes the letter case."],
        ["replace(a, b)", "Replaces text inside each value."],
        ["contains(text)", "True/False for filtering rows."],
      ],
      tip: "Chain them: s.str.strip().str.title() cleans most name and city columns in one line.",
      mistake: ".str only works on text columns. On numbers it raises \"Can only use .str accessor with string values\".",
      code: `import pandas as pd

df = pd.read_csv("messy.csv")
print("Before:", df["city"].unique())

df["city"] = df["city"].str.strip().str.title()
df["customer"] = df["customer"].str.strip().str.title()

print("After: ", df["city"].unique())
df[["customer", "city"]]`,
    },
    {
      id: "replace",
      name: "df.replace()",
      signature: "df.replace(to_replace, value)  ·  df.replace({'old': 'new'})",
      summary: "Swaps specific values for other values.",
      explain: "Good for fixing placeholder text like 'unknown', 'N/A' or '-', or for renaming codes. It replaces whole values, not part of the text. Use .str.replace for that.",
      params: [
        ["to_replace", "A value, a list of values, or a dict {old: new}."],
        ["value", "What to put in their place."],
      ],
      tip: "Turn fake blanks into real ones with df.replace(['unknown', 'N/A', '-'], pd.NA), then use fillna or dropna.",
      mistake: "replace('chen', 'x') does nothing to 'chennai', because it matches whole values only. Use .str.replace.",
      code: `import pandas as pd

df = pd.read_csv("messy.csv")
df["age"] = df["age"].replace("unknown", pd.NA)
df["city"] = df["city"].str.strip().str.title().replace({"Trichy": "Tiruchirappalli"})

df[["customer", "age", "city"]]`,
    },
    {
      id: "astype",
      name: "astype() / pd.to_numeric()",
      signature: "s.astype('int64')  ·  pd.to_numeric(s, errors='coerce')",
      summary: "Converts a column to the right data type.",
      explain: "Numbers stored as text can't be added or averaged. astype converts when every value is valid. pd.to_numeric with errors='coerce' turns bad values into NaN instead of crashing.",
      params: [
        ["astype(type)", "'int64', 'float64', 'string', 'category', 'bool', or 'Int64' (an integer type that allows blanks)."],
        ["errors='coerce'", "In to_numeric/to_datetime, invalid values become NaN or NaT."],
      ],
      tip: "Use 'Int64' (capital I) for whole numbers that have blanks. Plain int64 can't hold NaN.",
      mistake: "df['age'].astype(int) crashes on 'unknown' or blanks. Clean them first or use to_numeric.",
      code: `import pandas as pd

df = pd.read_csv("messy.csv")
print("Before:", df["age"].dtype)

df["age"] = pd.to_numeric(df["age"], errors="coerce").astype("Int64")

print("After: ", df["age"].dtype)
print("Average age:", round(df["age"].mean(), 1))`,
    },
    {
      id: "rename_drop",
      name: "rename() / drop()",
      signature: "df.rename(columns={'old': 'new'})  ·  df.drop(columns=[...])",
      summary: "Renames columns and removes the ones you don't need.",
      explain: "Clear column names make every later step easier to read. Drop columns you don't need so the table stays small and easy to understand.",
      params: [
        ["rename(columns=...)", "A dict of {old name: new name}."],
        ["drop(columns=...)", "List of columns to remove."],
      ],
      tip: "To make every name lowercase snake_case: df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_').",
      mistake: "drop('phone') without columns= looks for a row named 'phone' and raises a KeyError.",
      code: `import pandas as pd

df = pd.read_csv("messy.csv")
df = df.rename(columns={"customer": "name", "spend": "total_spend"})
df = df.drop(columns=["phone"])

print(df.columns.tolist())`,
    },
  ],
};
