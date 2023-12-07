import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

const config = {
  input: "./babel/dist/client/app.js",
  output: {
    dir: "./dist/client",
    format: "iife",
  },
  format: "cjs",
  plugins: [commonjs(), babel({ babelHelpers: "bundled" })],
};

export default config;
