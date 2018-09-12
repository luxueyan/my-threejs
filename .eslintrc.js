module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    'plugin:vue/essential',
    // '@vue/prettier'
    '@vue/standard'
  ],
  plugins: ['vue', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'space-before-function-paren': 0,
    'spaced-comment': [0, 'never'],
    indent: [
      2,
      2,
      {
        SwitchCase: 1
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
