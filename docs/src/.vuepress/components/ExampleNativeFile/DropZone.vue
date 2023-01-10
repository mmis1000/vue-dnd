<template>
    <div
        class="box"
        :style="extraStyle"
        v-bind="propsItem"
    >
        <img v-if="image" :src="image" alt="">
        <div v-else class="placeholder">Drop image here</div>
    </div>
</template>
<script setup lang='ts'>
import { NativeFile, useDroppable } from '@mmis1000/vue-dnd';
import { computed, ref } from 'vue';
import { useLogger } from '../example-util';

const log = useLogger()

const image = ref('')
const { propsItem, hoverState } = useDroppable(
        NativeFile
        .withFilter(ev => {
            return (ev.dataTransfer?.types.indexOf('Files') ?? -1) >= 0
        }),
            {
        onDrop: (ev) => {
            if (ev.dataTransfer?.files.length ?? 0 > 0) {
                const file = ev.dataTransfer!.files.item(0)!
                if (!file.type.startsWith('image/')) {
                    log('not a image')
                    return
                }
                const url = URL.createObjectURL(file)
                if (image.value !== '') {
                    URL.revokeObjectURL(image.value)
                }
                image.value = url
                log(`A image dropped`)
            }
        }
    }
);
const extraStyle = computed(() => {
    if (!hoverState.dragging) {
        return {} // we aren't even dragging
    }
    if (hoverState.hover) {
        if (hoverState.accepted) {
            return {
                background: 'green'
            }
        } else {
            return {
                background: 'red'
            }
        }
    } else {
        if (hoverState.accepted) {
            return {
                background: 'blue'
            }
        } else {
            return {}
        }
    }
})
</script>
<style scoped>
.box {
    background: #777;
    border-radius: 10px;
    height: 150px;
    width: 150px;
    box-sizing: border-box;
    margin: 5px;

    display: flex;
    align-items: stretch;
    justify-content: stretch;
    overflow: hidden;
}

.box img {
    flex-grow: 1;
    display: block;
    object-fit: contain;
}

.placeholder {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>