module.exports = ({ config }) => {
    for (const [index, rule] of config.module.rules.entries()) {
        if (rule.use) {
            let isTarget = false
            for (const loader of rule.use) {
                if ('string' === typeof loader.loader && loader.loader.indexOf('ts-loader') > 0) {
                    isTarget = true
                    // const tsOptions = loader.options
                    // tsOptions.appendTsSuffixTo = []
                    // tsOptions.appendTsxSuffixTo = [/\.vue/]
                }
            }

            if (isTarget) {
                rule.test = /\.ts$/
                const ruleClone = {
                    ...rule,
                    test: /\.tsx$/,
                    use: [...rule.use.map(i => ({
                        ...i,
                        options: {
                            ...i.options,
                            ...(i.loader.indexOf('ts-loader') > 0) ? {
                                appendTsSuffixTo: [],
                                appendTsxSuffixTo: [/\.vue/]
                            } : {}
                        }
                    }))]
                }

                config.module.rules.splice(index, 0, ruleClone)
                break
            }
        }
    }

    config.module.rules.unshift({
        resourceQuery: /raw/,
        type: 'asset/source',
    })

    return config;
};