import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat();

const config = [
  {
    ignores: [".next/**", "out/**", "docs/**", "public/**"],
  },
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
