import ExampleHandle from '../components/ExampleHandle.vue';
import exampleSimpleSource from '!../components/ExampleSimple.vue?raw';
import exampleItemWithHandleSource from '!../components/example/ExampleItemWithHandle.vue?raw';
import exampleBucketSource from '!../components/example/ExampleBucket.vue?raw';
import exampleBoardSource from '!../components/example/ExampleBoard.vue?raw';
import exampleType from '!../components/example/exampleType.ts?raw';
export default {
  title: 'VueDnd/DragHandle',
  component: ExampleHandle,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    usePointerEvent: {
      type: { name: 'boolean', required: false },
      defaultValue: false,
      description: 'whether using the native drag and drop of emulated pointer events based drag and drop',
    },
  },
  parameters: {
    componentSource: {
      code: [
        exampleSimpleSource,
        exampleItemWithHandleSource,
        exampleBucketSource,
        exampleBoardSource,
        exampleType
      ],
      language: 'html',
    }
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { ExampleHandle },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<example-handle v-bind="args" />',
});

export const NativeEvents = Template.bind({});
NativeEvents.args = {
  // More on composing args: https://storybook.js.org/docs/vue/writing-stories/args#args-composition
  usePointerEvent: false
};

export const PointerEvents = Template.bind({});
PointerEvents.args = {
  // More on composing args: https://storybook.js.org/docs/vue/writing-stories/args#args-composition
  usePointerEvent: true
};
