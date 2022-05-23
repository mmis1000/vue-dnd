module.exports = ({ config }) => {
    config.module.rules.unshift({
        resourceQuery: /raw/,
        type: 'asset/source',
    })

    return config;
};