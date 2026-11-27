// Prints all guide content as JSON for build_site.py.
import { categories, qa, datasets } from "../src/data/index.js";

console.log(JSON.stringify({ categories, qa, datasets }));
