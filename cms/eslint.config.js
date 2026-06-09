import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import a11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { 
      react: { version: '18.3' },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': a11y,
      'import': importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...a11y.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      
      // React specific rules
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-key': 'warn',
      'react/display-name': 'off',
      'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.js'] }],
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      'react/jsx-boolean-value': ['warn', 'never'],
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-pascal-case': 'warn',
      'react/jsx-sort-props': 'off',
      'react/no-array-index-key': 'warn',
      'react/no-unused-prop-types': 'warn',
      'react/no-unused-state': 'warn',
      'react/prefer-stateless-function': 'warn',
      'react/self-closing-comp': 'warn',
      
      // React Hooks rules
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      
      // React Refresh rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // Accessibility rules
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      
      // Import rules
      'import/no-unresolved': 'warn',
      'import/named': 'warn',
      'import/default': 'warn',
      'import/namespace': 'warn',
      'import/no-duplicates': 'warn',
      'import/order': ['warn', {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
      }],
      
      // General rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'indent': ['warn', 2],
      'quotes': ['warn', 'single', { 'avoidEscape': true }],
      'semi': ['warn', 'always'],
      'comma-dangle': ['warn', 'always-multiline'],
    },
  },
]
