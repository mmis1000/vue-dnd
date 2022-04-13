<script lang="tsx">
import { computed } from '@vue/reactivity';
import { defineComponent, PropType, reactive } from 'vue';
import { useDraggable, useDroppable } from '../packages/vue-dnd';
import { useHtmlProvider } from '../packages/vue-dnd/use-html-provider';

type Message = [currentBucket: number, id: number]

const Ball = defineComponent({
  props: {
    currentBucket: {
      type: Number,
      required: true
    },
    id: {
      type: Number,
      required: true
    }
  },
  setup (props) {
    const { wrap } = useDraggable<Message>(
      // Specify what did you want to send to the dropzone, can either be ref or raw value
      computed(() => [props.currentBucket, props.id]), 
      {}
    )
    return () => wrap(<div class="ball" >{ props.id }</div>)
  }
})

const Bucket = defineComponent({
  props: {
    id: {
      type: Number,
      required: true
    },
    onDrop: {
      type: Function as PropType<(item: number, oldBucket: number, newBucket: number) => void>,
      required: true
    }
  },
  setup (props, ctx) {
    const { wrap, hoverState } = useDroppable<Message>({
      // Declare whether you want to receive the draggable item or not
      // A predicate function or raw value
      accept: (msg) => msg[0] !== props.id,
      // The drop zone receives message from draggable item
      onDrop: (ev, data) => {
        props.onDrop(data[1], data[0], props.id)
      }
    })
    return () => wrap(<div class={ hoverState.hover ? 'bucket hover' : 'bucket'}>{ ctx.slots.default?.() }</div>)
  }
})

export default {
  setup () {
    useHtmlProvider()

    const buckets = reactive(new Array(5).fill(null).map(() => [] as number[]))
    buckets[0].push(1, 2, 3, 4, 5)

    const onDrop = (id: number, oldBucket: number, newBucket: number) => {
      console.log(id, oldBucket, newBucket)
      buckets[oldBucket] = buckets[oldBucket].filter(i => i !== id)
      buckets[newBucket] = buckets[newBucket].concat([id])
    }

    return () => <div class="board">
      {
        buckets.map((b, index) => <Bucket id={index} key={index} onDrop={onDrop}>
          {
            b.map((i, index2) => <Ball id={i} currentBucket={index} key={index2} />)
          }
        </Bucket>)
      }
    </div>
  }
}
</script>
<style scoped>
.board {
  display: flex;
  flex: 0 0 auto;
}
.bucket {
  width: 200px;
  border: 4px solid blue;
}

.hover {
  background: #ccc;
}

.ball {
  width: 50px;
  height: 50px;
  background: red;
  border-radius: 50%;
}
</style>
