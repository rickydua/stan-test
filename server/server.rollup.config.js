import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

const config = {
  input: "./babel/dist/server/server.js",
  output: {
    dir: "./dist/server/",
  },
  format: "cjs",
  plugins: [commonjs(), babel({ babelHelpers: "bundled" })],
};

export default config;
