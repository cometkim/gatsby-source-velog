module.exports = {
    parser: 'babel-eslint',
    plugins: [
        'flowtype',
    ],
    extends: [
        'eslint:recommended',
        'plugin:flowtype/recommended',
    ],
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single'],
        semi: ['error', 'never'],
        'no-console': ['off'],
    },
}
