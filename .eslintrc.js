module.exports = {
    parser: 'babel-eslint',
    env: {
        node: true,
        es6: true,
    },
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
        semi: ['error', 'always'],
        'no-console': ['off'],
    },
}
