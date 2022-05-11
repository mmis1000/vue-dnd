import ExampleSimple from '../components/ExampleSimple.vue';
export default {
  title: 'VueDnd/SimpleBoart',
  component: ExampleSimple,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    usePointerEvent: {
      type: { name: 'boolean', required: false },
      defaultValue: false,
      description: 'whether using the native drag and drop of emulated pointer events based drag and drop',
    },
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { ExampleSimple },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<example-simple v-bind="args" />',
});

export const PointerEvents = Template.bind({});
PointerEvents.args = {
  // More on composing args: https://storybook.js.org/docs/vue/writing-stories/args#args-composition
  usePointerEvent: true
};

export const NativeEvents = Template.bind({});
NativeEvents.args = {
  // More on composing args: https://storybook.js.org/docs/vue/writing-stories/args#args-composition
  usePointerEvent: false
};