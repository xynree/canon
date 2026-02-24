// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default [
  defineConfig([
    expoConfig,
    {
      ignores: ["dist/*"],
    },
  ]),
  eslintConfigPrettier,
];
