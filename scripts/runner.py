"""Runs one editor cell, notebook style.

run_cell(source) executes the code and returns a JSON string:
  stdout  - everything printed (print, df.info(), warnings)
  table   - HTML for the last line when it is a DataFrame
  value   - text for the last line when it is any other value
  images  - base64 PNGs for every matplotlib figure created
  error   - short, readable error message, or None
"""

import ast
import base64
import contextlib
import io
import json
import linecache
import traceback

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt  # noqa: E402
import pandas as pd  # noqa: E402

pd.set_option("display.width", 110)
pd.set_option("display.max_columns", 20)
plt.rcParams.update({"figure.figsize": (6.4, 3.8), "figure.dpi": 100})
plt.show = lambda *args, **kwargs: None  # figures are collected after the run instead

CELL_NAME = "<editor>"


def _is_plot_object(value):
    module = type(value).__module__ or ""
    return module.startswith("matplotlib")


def _split_last_expression(tree):
    """Remove a trailing expression from the tree so it can be displayed."""
    if tree.body and isinstance(tree.body[-1], ast.Expr):
        return ast.Expression(tree.body.pop().value)
    return None


def _format_error(exc):
    if isinstance(exc, SyntaxError):
        return f"Line {exc.lineno}: SyntaxError: {exc.msg}"
    frames = [f for f in traceback.extract_tb(exc.__traceback__) if f.filename == CELL_NAME]
    where = f"Line {frames[-1].lineno}: {frames[-1].line}\n" if frames else ""
    return f"{where}{type(exc).__name__}: {exc}"


def _collect_figures():
    images = []
    for number in plt.get_fignums():
        buffer = io.BytesIO()
        plt.figure(number).savefig(buffer, format="png", dpi=110, bbox_inches="tight")
        images.append(base64.b64encode(buffer.getvalue()).decode("ascii"))
    plt.close("all")
    return images


def _describe_value(value):
    if value is None or _is_plot_object(value):
        return None, None
    if isinstance(value, pd.DataFrame):
        return value.to_html(max_rows=20, border=0, classes="df-table"), None
    return None, repr(value)


def run_cell(source):
    linecache.cache[CELL_NAME] = (len(source), None, source.splitlines(True), CELL_NAME)
    printed = io.StringIO()
    table, value, error = None, None, None
    try:
        tree = ast.parse(source, CELL_NAME)
        last = _split_last_expression(tree)
        scope = {"__name__": "__main__"}
        with contextlib.redirect_stdout(printed), contextlib.redirect_stderr(printed):
            exec(compile(tree, CELL_NAME, "exec"), scope)
            if last is not None:
                table, value = _describe_value(eval(compile(last, CELL_NAME, "eval"), scope))
    except Exception as exc:  # show any user error in the output panel
        error = _format_error(exc)
    return json.dumps({
        "stdout": printed.getvalue(),
        "table": table,
        "value": value,
        "images": _collect_figures(),
        "error": error,
    })
