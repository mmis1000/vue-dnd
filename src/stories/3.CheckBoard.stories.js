import Board from '../components/ChessBoard.vue';
import boardSource from '!../components/ChessBoard.vue?raw';
import myDragSource from '!../components/board/MyDrag.vue?raw';
import myDropSource from '!../components/board/MyDrop.vue?raw';
export default {
  title: 'VueDnd/CheckBoard',
  component: Board,
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
        boardSource,
        myDragSource,
        myDropSource,
      ],
      language: 'html',
    }
  },
};

// More on component templates: https://storybook.js.org/docs/vue/writing-stories/introduction#using-args
const Template = (args) => ({
  // Components used in your story `template` are defined in the `components` object
  components: { Board },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<board v-bind="args" />',
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
