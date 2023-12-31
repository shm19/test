module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [],
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/prefer-default-export': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'no-useless-constructor': 'off',
    'class-methods-use-this': 'off',
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'no-continue': 'off',
    'max-classes-per-file': 'off',
    'no-underscore-dangle': 'off',
    'consistent-return': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-restricted-syntax': 'off',
  },
};
