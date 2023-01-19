<script lang="tsx">
import { defineComponent } from "vue";
export default defineComponent({
  setup(props, { slots }) {
    return () => (
      <div class="board">
        {slots.default?.()}
      </div>
    );
  },
});

</script>
<style scoped>
.board {
  display: flex;
  flex: 0 0 auto;
}
</style>