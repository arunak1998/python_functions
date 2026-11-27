import loading from "./categories/loading.js";
import exploration from "./categories/exploration.js";
import cleaning from "./categories/cleaning.js";
import transformation from "./categories/transformation.js";
import aggregation from "./categories/aggregation.js";
import analysis from "./categories/analysis.js";
import visualization from "./categories/visualization.js";

export const categories = [
  loading,
  exploration,
  cleaning,
  transformation,
  aggregation,
  analysis,
  visualization,
];

export const totalFunctions = categories.reduce((sum, c) => sum + c.functions.length, 0);

export { default as qa } from "./qa.js";
export { default as datasets } from "./datasets.js";
