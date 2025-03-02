module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Fix ESM/CommonJS interoperability issues
            webpackConfig.module.rules.push({
                test: /\.mjs$/,
                include: /node_modules/,
                type: 'javascript/auto'
            });

            // Fix potential polyfill issues
            webpackConfig.resolve.fallback = {
                ...webpackConfig.resolve.fallback,
                'stream': require.resolve('stream-browserify'),
                'process': require.resolve('process/browser')
            };

            // Add process polyfill
            const { DefinePlugin } = require('webpack');
            webpackConfig.plugins.push(
                new DefinePlugin({
                    'process.env': JSON.stringify(process.env)
                })
            );

            return webpackConfig;
        }
    },
    // Customize Babel with consistent loose mode settings
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
    // Fix Jest configuration for testing
    jest: {
        configure: {
            moduleNameMapper: {
                '^react-router-dom(.*)$': '<rootDir>/node_modules/react-router-dom$1'
            }
        }
    }
};