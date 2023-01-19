<script lang="tsx">
import { defineComponent } from "vue";
import { useHtmlProvider } from "../../../../../packages/vue-dnd/use-html-provider";
import ImageViewer from "./ImageViewer.vue";

export default defineComponent({
  setup() {
    useHtmlProvider();

    return () => <div>
      <ImageViewer></ImageViewer>
    </div>
  },
});
</script>