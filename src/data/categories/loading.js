export default {
  id: "loading",
  number: "01",
  title: "Data Loading",
  verb: "Load",
  lead: "Every analysis starts by getting data into a DataFrame, which is a table with rows and columns. These functions read files, databases and web pages, and save your results back out.",
  functions: [
    {
      id: "dataframe",
      name: "pd.DataFrame()",
      signature: "pd.DataFrame(data, columns=None, index=None)",
      summary: "Builds a table directly from Python data.",
      explain: "Pass a dictionary where each key is a column name and each value is a list of that column's values. This is the quickest way to make small test data without needing a file.",
      params: [
        ["data", "A dict of lists, a list of dicts, or a list of lists."],
        ["columns", "Column names, or the order to show them in."],
        ["index", "Custom row labels. The default is 0, 1, 2, …"],
      ],
      tip: "A list of dicts also works, where each dict is one row: pd.DataFrame([{'a': 1}, {'a': 2}]).",
      mistake: "Every list in the dict must be the same length, or you get \"ValueError: All arrays must be of the same length\".",
      code: `import pandas as pd

data = {
    "product": ["Laptop", "Mouse", "Chair"],
    "price": [55000, 600, 7000],
    "in_stock": [True, True, False],
}
df = pd.DataFrame(data)
df`,
    },
    {
      id: "read_csv",
      name: "pd.read_csv()",
      signature: "pd.read_csv(path, sep=',', usecols=None, parse_dates=None, nrows=None)",
      summary: "Reads a CSV file into a DataFrame.",
      explain: "CSV is the most common data format, so this is the function you will use most. pandas works out the column names from the first row and guesses each column's type.",
      params: [
        ["path", "File name, file path or URL."],
        ["usecols", "Load only these columns. This saves memory on big files."],
        ["parse_dates", "Columns to turn into real dates while loading."],
        ["nrows", "Read only the first n rows, which is handy for a quick look."],
      ],
      tip: "Use parse_dates=['order_date'] here so you don't have to call pd.to_datetime later.",
      mistake: "A semicolon-separated file loads as one big column. Fix it with sep=';'.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv", parse_dates=["order_date"])
print(df.shape)
df.head()`,
    },
    {
      id: "read_excel",
      name: "pd.read_excel()",
      signature: "pd.read_excel(path, sheet_name=0, usecols=None, skiprows=None)",
      summary: "Reads a sheet from an Excel (.xlsx) file.",
      explain: "Works just like read_csv, but for Excel workbooks. Choose a sheet by name or position, and pandas reads it into a DataFrame.",
      params: [
        ["sheet_name", "Sheet name or number. Use None to load every sheet into a dict."],
        ["usecols", "Columns to keep, e.g. 'A:D' or a list of names."],
        ["skiprows", "Rows to skip at the top, such as title rows."],
      ],
      tip: "sheet_name=None returns {sheet name: DataFrame} for the whole workbook in one call.",
      mistake: "It needs the openpyxl package. In this site it is installed automatically on the first run.",
      code: `import pandas as pd

orders = pd.read_excel("sales.xlsx", sheet_name="orders")
all_sheets = pd.read_excel("sales.xlsx", sheet_name=None)

print("Sheets:", list(all_sheets))
orders.head(3)`,
    },
    {
      id: "read_json",
      name: "pd.read_json()",
      signature: "pd.read_json(path, orient=None, lines=False)",
      summary: "Reads JSON, the format most web APIs return.",
      explain: "Converts a JSON array of objects into rows. For nested JSON straight from an API, use pd.json_normalize, which flattens it.",
      params: [
        ["orient", "The JSON's shape: 'records' (a list of rows), 'columns', 'index' and so on."],
        ["lines", "True for JSON Lines files, which have one object per line."],
      ],
      tip: "For nested data, use pd.json_normalize(api_response) to turn keys like 'user.name' into columns.",
      mistake: "\"Trailing data\" errors usually mean the file is JSON Lines, so add lines=True.",
      code: `import pandas as pd

df = pd.read_json("sales.json")
print(df.dtypes)
df.head(3)`,
    },
    {
      id: "read_sql",
      name: "pd.read_sql()",
      signature: "pd.read_sql(query, connection, params=None, parse_dates=None)",
      summary: "Runs a SQL query and returns the result as a DataFrame.",
      explain: "Connect to a database, write normal SQL, and get a DataFrame back. It works with SQLite, PostgreSQL, MySQL and others (use SQLAlchemy for those).",
      params: [
        ["query", "A SQL string, or a table name."],
        ["connection", "A sqlite3 connection or a SQLAlchemy engine."],
        ["params", "Values for ? placeholders. They are safer than building the SQL string yourself."],
      ],
      tip: "Filter and join inside SQL when the table is huge, so only the rows you need come into Python.",
      mistake: "Don't build queries with f-strings from user input. Use params to avoid SQL injection.",
      code: `import sqlite3
import pandas as pd

conn = sqlite3.connect("shop.db")
query = """
    SELECT region, SUM(units * unit_price) AS revenue
    FROM sales
    GROUP BY region
    ORDER BY revenue DESC
"""
df = pd.read_sql(query, conn)
conn.close()
df`,
    },
    {
      id: "read_html",
      name: "pd.read_html()",
      signature: "pd.read_html(source, match='.+', header=None)",
      summary: "Pulls every <table> out of a web page.",
      explain: "Give it a URL or some HTML and it returns a list of DataFrames, one for each table it finds. It is a quick way to grab tables from Wikipedia or a report page.",
      params: [
        ["source", "A URL, a file path, or an HTML string wrapped in StringIO."],
        ["match", "Keep only tables that contain this text."],
      ],
      tip: "It always returns a list, so take the table you want with [0].",
      mistake: "Pages that build their tables with JavaScript have no <table> in the raw HTML, so you get \"No tables found\".",
      code: `import pandas as pd

tables = pd.read_html("targets.html")
print("Tables found:", len(tables))
targets = tables[0]
targets`,
    },
    {
      id: "to_csv",
      name: "df.to_csv()",
      signature: "df.to_csv(path, index=True, columns=None)",
      summary: "Saves a DataFrame to a CSV file.",
      explain: "This is the opposite of read_csv. Use it to save your cleaned data, or to share results with someone who uses Excel or another tool.",
      params: [
        ["path", "File name to write. Leave it empty to get the CSV back as a string."],
        ["index", "Set False to skip writing the row numbers as an extra column."],
        ["columns", "Write only these columns."],
      ],
      tip: "Almost always pass index=False. Otherwise you'll find an unwanted 'Unnamed: 0' column next time you load the file.",
      mistake: "Forgetting index=False and then wondering where 'Unnamed: 0' came from.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
top = df[df["unit_price"] > 10000]

top.to_csv("expensive_orders.csv", index=False)

# Read it back to confirm the save worked
pd.read_csv("expensive_orders.csv").head(3)`,
    },
    {
      id: "to_excel",
      name: "df.to_excel()",
      signature: "df.to_excel(path, sheet_name='Sheet1', index=True)",
      summary: "Saves a DataFrame to an Excel workbook.",
      explain: "Writes one DataFrame to one sheet. To write several sheets into the same file, use pd.ExcelWriter.",
      params: [
        ["sheet_name", "Name of the sheet to write."],
        ["index", "Set False to leave out the row numbers."],
      ],
      tip: "Use `with pd.ExcelWriter('report.xlsx') as w:` and call to_excel(w, sheet_name=...) for each sheet.",
      mistake: "Calling to_excel twice on the same file name overwrites it, so the first sheet disappears.",
      code: `import pandas as pd

df = pd.read_csv("sales.csv")
summary = df.groupby("region", as_index=False)["units"].sum()

with pd.ExcelWriter("report.xlsx") as writer:
    df.to_excel(writer, sheet_name="orders", index=False)
    summary.to_excel(writer, sheet_name="summary", index=False)

pd.read_excel("report.xlsx", sheet_name="summary")`,
    },
  ],
};
