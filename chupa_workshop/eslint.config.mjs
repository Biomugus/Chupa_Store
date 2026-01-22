import { defineConfig, globalIgnores } from 'eslint/config';
import next from 'eslint-config-next';

export default defineConfig([
  ...next['core-web-vitals'],

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'node_modules/**',
    'next-env.d.ts',
  ]),

  {
    plugins: ['prettier'],
    extends: ['plugin:prettier/recommended'], // добавляем интеграцию Prettier
    rules: {
      'prettier/prettier': 'error', // чтобы Prettier ошибки фиксились
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off'
    },
  },
]);
