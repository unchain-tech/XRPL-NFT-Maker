module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: ['standard', 'prettier', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'no-lone-blocks': ['off'],
    'no-unused-vars': ['warn'],
    'react/prop-types': ['off'],
    'react/jsx-uses-react': ['off'],
    'react/react-in-jsx-scope': ['off'],
  },
  settings: {
    react: {
      version: '18.2.0',
    },
  },
};
