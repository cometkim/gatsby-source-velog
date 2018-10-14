module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: {
                node: 'current',
            },
            loose: true,
            useBuiltIns: true,
            shippedProposals: true,
        }],
        '@babel/preset-flow',
    ],
}
