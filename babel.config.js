module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: 8,
            },
            loose: true,
            useBuiltIns: 'usage',
            shippedProposals: true,
        }],
        '@babel/preset-flow',
    ],
    plugins: [
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-object-rest-spread',
    ],
};
