module.exports = {
  typescript: {
    check: false,
    checkOptions: {}
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  core: {
    builder: "webpack5",
  },
  features: {
    babelModeV7: true,
  },
  "framework": "@storybook/vue3"
}