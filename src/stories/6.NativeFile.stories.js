import DropNative from '../components/DropNative';
import dropNativeSource from '!../components/DropNative.vue?raw';
import imageViewerSource from '!../components/dropNative/ImageViewer.vue?raw';
export default {
  title: 'VueDnd/NativeFile',
  component: DropNative,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  parameters: {
    componentSource: {
      code: [
        dropNativeSource,
        imageViewerSource,
      ],
      language: 'html',
    }
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { DropNative },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<drop-native v-bind="args" />',
});

export const Demo = Template.bind({});
Demo.args = {};

