module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    env: {
        node: true,
        es2021: true,
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:node/recommended',
      'prettier',
    ],
    rules: {
      'prettier/prettier': 'error',
      'node/no-unsupported-features/es-syntax': [
        'error',
        { ignores: ['modules'] },
      ],
      'node/no-missing-import': [
        'error',
        {
          allowModules: [],
          resolvePaths: ['./src'],
          tryExtensions: ['.js', '.json', '.node', '.ts'],
        },
      ],
      'node/no-unpublished-import': 'off',
      'no-console': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'node/no-unsupported-features/es-syntax': [
        'error',
        {
          version: '>=18.0.0',
          ignores: ['modules']
        }
      ],
    },
  };