import ExampleSimple from '../components/ExampleSimple.vue';
import exampleSimpleSource from '!../components/ExampleSimple.vue?raw';
import exampleBallSource from '!../components/example/ExampleBall.vue?raw';
import exampleBucketSource from '!../components/example/ExampleBucket.vue?raw';
import exampleBoardSource from '!../components/example/ExampleBoard.vue?raw';
import exampleType from '!../components/example/exampleType.ts?raw';
export default {
  title: 'VueDnd/SimpleBoard',
  component: ExampleSimple,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    usePointerEvent: {
      type: { name: 'boolean', required: false },
      defaultValue: false,
      description: 'whether using the native drag and drop of emulated pointer events based drag and drop',
    },
    useCustomPreview: {
      type: { name: 'boolean', required: false },
      defaultValue: false,
      description: 'whether using the custom dom based preview',
    },
  },
  parameters: {
    componentSource: {
      code: [
        exampleSimpleSource,
        exampleBallSource,
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
  components: { ExampleSimple },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<example-simple v-bind="args" />',
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

export const NativeEventsWithCustomPreview = Template.bind({});
NativeEventsWithCustomPreview.args = {
  // More on composing args: https://storybook.js.org/docs/vue/writing-stories/args#args-composition
  usePointerEvent: false,
  useCustomPreview: true
};

export const PointerEventsWithCustomPreview = Template.bind({});
PointerEventsWithCustomPreview.args = {
  // More on composing args: https://storybook.js.org/docs/vue/writing-stories/args#args-composition
  usePointerEvent: true,
  useCustomPreview: true
};