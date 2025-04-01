module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.module.rules.push({
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            });

            webpackConfig.resolve.fallback = {
                ...webpackConfig.resolve.fallback,
                'stream': require.resolve('stream-browserify'),
                'process': require.resolve('process/browser')
            };

            const { DefinePlugin } = require('webpack');
            webpackConfig.plugins.push(
                new DefinePlugin({
                    'process.env': JSON.stringify(process.env)
                })
            );

            return webpackConfig;
        }
    },
    babel: {
        looseMode: true,
        presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            '@babel/preset-typescript',
            ['@babel/preset-react', { runtime: 'automatic' }]
        ],
        plugins: [
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-transform-private-methods', { loose: true }],
            ['@babel/plugin-transform-private-property-in-object', { loose: true }],
            '@babel/plugin-transform-runtime'
        ]
    },
    jest: {
        configure: {
            moduleNameMapper: {
                '^react-router-dom(.*)$': '<rootDir>/node_modules/react-router-dom$1'
            }
        }
    }
};