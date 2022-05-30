<script lang="tsx">
import { defineComponent, ref } from "vue";
import { useDroppable, NativeFile } from "../../packages/vue-dnd";

export default defineComponent({
  setup(props, { slots }) {
    const image = ref('')

    const { propsItem } = useDroppable({
      accept: NativeFile,
      onDrop(ev) {
        if (ev.dataTransfer?.files.length ?? 0 > 0) {
          const file = ev.dataTransfer!.files.item(0)!
          if (!file.type.startsWith('image/')) {
            alert('not a image')
            return
          }
          const url = URL.createObjectURL(file)
          if (image.value !== '') {
            URL.revokeObjectURL(image.value)
          }
          image.value = url
        }
      }
    });
    return () => <div class="viewer">
      <img src={image.value} alt="" />
      <div class="overlay" {...propsItem()}>
        Drag image file into here
      </div>
    </div>
  },
});

</script>
<style scoped>
.viewer {
  width: 200px;
  height: 200px;
  position: relative;
  border: 2px solid grey;
}

.viewer img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: sans-serif;
}
</style>