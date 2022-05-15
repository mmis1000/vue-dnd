import List from '../components/SortableList.vue';
import listSource from '!../components/SortableList.vue?raw';
import myDragSource from '!../components/sortable/Item.vue?raw';
import myDropSource from '!../components/sortable/List.vue?raw';
export default {
  title: 'VueDnd/SortableList',
  component: List,
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
        listSource,
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
  components: { List },
  // The story's `args` need to be mapped into the template through the `setup()` method
  setup() {
    return { args };
  },
  // And then the `args` are bound to your component with `v-bind="args"`
  template: '<list v-bind="args" />',
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
