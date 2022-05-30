import StartDirection from '../components/StartDirection';
import startDirectionSource from '!../components/StartDirection.vue?raw';
import startDirectionSourceDraggable from '!../components/startDirection/StartDirectionDraggable.vue?raw';
export default {
  title: 'VueDnd/StartDirection',
  component: StartDirection,
  // More on argTypes: https://storybook.js.org/docs/vue/api/argtypes
  argTypes: {
    usePointerEvent: {
      type: { name: 'boolean', required: false },
      defaultValue: false,
      description: 'whether using the native drag and drop of emulated pointer events based drag and drop',
    },
    startDirection: {
      type: { required: false },
      options: ['all', 'x', 'y'],
      defaultValue: 'all',
      description: 'valid start direction',
    },
  },
  parameters: {
    componentSource: {
      code: [
        startDirectionSource,
        startDirectionSourceDraggable,
      ],
      language: 'html',
    }
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { StartDirection },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<start-direction v-bind="args" />',
});

export const AllDirection = Template.bind({});
AllDirection.args = {
  // More on composing args: https://storybook.js.org/docs/vue/writing-stories/args#args-composition
  usePointerEvent: true,
  startDirection: 'all'
};

export const XOnly = Template.bind({});
XOnly.args = {
  // More on composing args: https://storybook.js.org/docs/vue/writing-stories/args#args-composition
  usePointerEvent: true,
  startDirection: 'x'
};

export const YOnly = Template.bind({});
YOnly.args = {
  // More on composing args: https://storybook.js.org/docs/vue/writing-stories/args#args-composition
  usePointerEvent: true,
  startDirection: 'y'
};

