module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    'standard',
    'plugin:json/recommended',
    'prettier',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'comma-dangle': 'off',
    'space-before-function-paren': 'off',
    'no-throw-literal': 'off',
    'jest/no-mocks-import': 'off',
  },
  plugins: ['jest'],
};
