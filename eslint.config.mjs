import tsEslintParser from "@typescript-eslint/parser";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";

export default [
  {
    ignores: ["node_modules/**"],
  },
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parser: tsEslintParser,
      ecmaVersion: 2020,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
    },
    rules: {
      // Aquí puedes añadir reglas personalizadas
    },
  },
];
