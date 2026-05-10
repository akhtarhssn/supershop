module.exports = {
  languageOptions: {
    globals: {
      node: true,
      es2021: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: './tsconfig.json',
      ecmaVersion: 2021,
      sourceType: 'module'
    }
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': 'warn',
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
    'linebreak-style': 'error',
    'semi': ['error', 'always']
  }
};