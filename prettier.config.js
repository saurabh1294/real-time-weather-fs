// The values provided below are the defaults.
// If you don't specify one of these properties,
// the default value will be applied.
module.exports = {
  printWidth: 140,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'none', // other options `es5` or `all`
  bracketSpacing: true,
  arrowParens: 'avoid', // other option 'always'
  parser: 'typescript',
  overrides: [
    {
      files: 'src/**/*.scss',
      options: {
        singleQuote: false,
        proseWrap: 'never',
				printWidth: 80
      }
    }
  ]
};
