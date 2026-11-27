export default {
  id: "visualization",
  number: "07",
  title: "Data Visualization",
  verb: "Visualize",
  lead: "A chart shows in a second what a table hides. pandas draws charts straight from a DataFrame using matplotlib, so press Run and the chart appears below the editor.",
  functions: [
    {
      id: "plot_line",
      name: "df.plot() — line",
      signature: "df.plot(x=None, y=None, kind='line', title=None, figsize=None)",
      summary: "Draws a line chart, the best choice for trends over time.",
      explain: "Call .plot() on a Series or DataFrame. The index goes on the x-axis and each column becomes a line. Use a date index for time trends.",
      params: [
        ["kind", "'line', 'bar', 'barh', 'hist', 'box', 'scatter', 'pie' or 'area'."],
        ["title / xlabel / ylabel", "Chart text."],
        ["marker", "'o' puts a dot on each data point."],
      ],
      tip: "df.plot(kind='bar') is the same as df.plot.bar(). Use whichever you find easier to read.",
      mistake: "If the data isn't sorted by date, the line jumps back and forth. Sort first.",
      code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("sales.csv", parse_dates=["order_date"])
df["revenue"] = df["units"] * df["unit_price"]

monthly = df.resample("ME", on="order_date")["revenue"].sum()
monthly.plot(marker="o", title="Monthly revenue", ylabel="₹ revenue")
plt.show()`,
    },
    {
      id: "plot_bar",
      name: "plot.bar() / barh()",
      signature: "s.plot.bar()  ·  s.plot.barh()  ·  df.plot.bar(stacked=True)",
      summary: "Compares values across categories.",
      explain: "Use a bar chart for 'which group is biggest?'. Horizontal bars (barh) are easier to read when category names are long. Sort first so the order means something.",
      params: [
        ["stacked", "True stacks the columns of a DataFrame on top of each other."],
        ["color", "One color, or a list of colors."],
        ["rot", "Rotation of the x labels in degrees."],
      ],
      tip: "Sort ascending before barh so the biggest bar ends up at the top.",
      mistake: "Plotting unsorted categories gives a chart that is hard to compare.",
      code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

by_product = df.groupby("product")["revenue"].sum().sort_values()
by_product.plot.barh(color="#8b7cff", title="Revenue by product")
plt.xlabel("₹ revenue")
plt.show()`,
    },
    {
      id: "plot_hist",
      name: "plot.hist()",
      signature: "s.plot.hist(bins=10)",
      summary: "Shows the distribution of one numeric column.",
      explain: "Splits the values into bins and counts how many fall in each. You can see whether most values are small, whether the data is skewed, or whether there are outliers.",
      params: [
        ["bins", "Number of bars. More bins show more detail."],
        ["alpha", "Transparency from 0 to 1, useful when you overlay histograms."],
      ],
      tip: "Try a few bin counts (5, 10, 20). The shape can change a lot.",
      mistake: "Don't use a histogram for categories. Use value_counts().plot.bar() instead.",
      code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("sales.csv")
df["units"].plot.hist(bins=6, color="#4fd1c5", edgecolor="white",
                      title="How many units per order?")
plt.xlabel("units")
plt.show()`,
    },
    {
      id: "plot_scatter",
      name: "plot.scatter()",
      signature: "df.plot.scatter(x='col1', y='col2', s=None, c=None)",
      summary: "Plots one number against another to see how they relate.",
      explain: "Each row becomes one dot. Use a scatter plot to check what corr() is telling you, and to spot clusters and outliers.",
      params: [
        ["x / y", "Column names for the two axes."],
        ["s", "Dot size: one number, or a column."],
        ["c", "Dot color: one color, or a column for a color scale."],
      ],
      tip: "Use logy=True when values range from hundreds to lakhs.",
      mistake: "x and y must be numeric columns. Convert text numbers first.",
      code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

df.plot.scatter(x="units", y="unit_price", s=df["revenue"] / 1500,
                alpha=0.6, color="#f5b84a", logy=True,
                title="Units vs price (dot size = revenue)")
plt.show()`,
    },
    {
      id: "plot_box",
      name: "plot.box()",
      signature: "df.plot.box()  ·  df.boxplot(column, by)",
      summary: "Compares distributions and shows outliers.",
      explain: "The box covers the middle 50% of values and the line inside it is the median. Dots beyond the whiskers are outliers. It's great for comparing groups side by side.",
      params: [
        ["column", "The numeric column to show."],
        ["by", "Draw one box for each group in this column."],
      ],
      tip: "df.boxplot(column='units', by='category') compares groups in one line.",
      mistake: "Box plots hide how many rows are in each group. Check with value_counts() too.",
      code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("sales.csv")
df.boxplot(column="units", by="category", grid=False)
plt.title("Units per order by category")
plt.suptitle("")
plt.show()`,
    },
    {
      id: "plot_pie",
      name: "plot.pie()",
      signature: "s.plot.pie(autopct='%1.0f%%')",
      summary: "Shows each part's share of a whole.",
      explain: "Pie charts work only for a few categories (2 to 5) that add up to 100%. For anything else, a bar chart is easier to read.",
      params: [
        ["autopct", "Label format for percentages, e.g. '%1.0f%%'."],
        ["startangle", "Rotates the pie, e.g. 90."],
      ],
      tip: "Add ylabel='' to remove the column name that pandas puts on the side.",
      mistake: "Pies with many slices are unreadable. Group the small ones into 'Other' or use bars.",
      code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("sales.csv")
df["revenue"] = df["units"] * df["unit_price"]

df.groupby("region")["revenue"].sum().plot.pie(
    autopct="%1.0f%%", startangle=90, ylabel="", title="Revenue share by region",
    colors=["#8b7cff", "#4fd1c5", "#f5b84a", "#ff6b6b"],
)
plt.show()`,
    },
    {
      id: "plot_area",
      name: "plot.area()",
      signature: "df.plot.area(stacked=True)",
      summary: "Shows a stacked total over time and how it splits into parts.",
      explain: "Think of it as a line chart with the area underneath filled in and the parts stacked. You see the total trend and each group's contribution at once.",
      params: [["stacked", "True stacks the layers (default). False overlaps them."]],
      tip: "Make a wide table first with pivot_table(index=date, columns=group).",
      mistake: "Negative values break stacked areas. Use a line chart instead.",
      code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("sales.csv", parse_dates=["order_date"])
df["revenue"] = df["units"] * df["unit_price"]
df["month"] = df["order_date"].dt.to_period("M")

wide = df.pivot_table(values="revenue", index="month", columns="category",
                      aggfunc="sum", fill_value=0)
wide.plot.area(alpha=0.7, title="Revenue by category over time",
               color=["#8b7cff", "#4fd1c5"])
plt.show()`,
    },
    {
      id: "subplots",
      name: "plt.subplots()",
      signature: "fig, axes = plt.subplots(nrows, ncols, figsize=(w, h))",
      summary: "Puts several charts side by side in one figure.",
      explain: "Make a grid of empty chart areas (axes), then draw into each one with ax=axes[i]. It's ideal for a small dashboard view.",
      params: [
        ["nrows / ncols", "Grid size."],
        ["figsize", "Width and height in inches."],
        ["ax", "Pass to df.plot(ax=...) to choose which chart area to draw in."],
      ],
      tip: "Call plt.tight_layout() at the end so titles and labels don't overlap.",
      mistake: "With a 2D grid, axes is a 2D array, so use axes[0, 1] rather than axes[1].",
      code: `import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("sales.csv", parse_dates=["order_date"])
df["revenue"] = df["units"] * df["unit_price"]

fig, axes = plt.subplots(1, 2, figsize=(10, 3.6))
df.resample("ME", on="order_date")["revenue"].sum().plot(
    ax=axes[0], marker="o", title="Monthly revenue")
df["region"].value_counts().plot.bar(
    ax=axes[1], color="#4fd1c5", rot=0, title="Orders by region")

plt.tight_layout()
plt.show()`,
    },
  ],
};
