module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    "plugins": ["@typescript-eslint"],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                '*.ts'
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "project": "./tsconfig.json",
    },
    "parser": "@typescript-eslint/parser",
    "rules": {
      "@typescript-eslint/no-explicit-any": 2,
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/restrict-plus-operands": "off",
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_"}],
      "no-case-declaration": "off"
    }
}
