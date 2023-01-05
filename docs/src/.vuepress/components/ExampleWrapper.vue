<template>
    <div class="example-wrapper__container">
        <div class="example-wrapper__title">
            {{ title }}
            <a v-if="source != null" :href="source" target="_blank">Source</a>
        </div>
        <div class="example-wrapper__pane-wrapper">
            <div class="example-wrapper__pane">
                <template v-if="mounted">
                    <slot></slot>
                </template>
            </div>
            <div class="example-wrapper__separator"></div>
            <div class="example-wrapper__pane">
                <div v-for="text of logs" :key="text" class="example-wrapper__log-text">
                    {{ text }}
                </div>
            </div>
        </div>
        <div class="example-wrapper__footer">
            <button class="example-wrapper__footer-button"
                :class="{ 'example-wrapper__footer-button--active': logPane }">Log</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useLoggerParent } from './example-util';

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    clientOnly: {
        type: Boolean,
        default: true
    },
    source: {
        type: String,
        default: null
    }
})
const mounted = ref(!props.clientOnly)
onMounted(() => {
    mounted.value = true
})

const { onLogged } = useLoggerParent()
const logs = reactive<string[]>([])

onLogged((...args) => {
    logs.push(args.map(i => JSON.stringify(i)).join(' '))
})

const logPane = ref(false)
</script>
<style scoped>
.example-wrapper__container {
    margin: 0.85rem 0;
    background-color: var(--code-bg-color);
    border-radius: 6px;
    box-sizing: border-box;
}

.example-wrapper__title {
    box-sizing: border-box;
    height: 40px;
    padding: 8px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: var(--font-family);
    font-size: .85em;
    line-height: 1.4;
    color: #ffffffe6;
    font-weight: 600;
    text-transform: capitalize;
}

.example-wrapper__pane-wrapper {
    height: 200px;
    display: flex;
    align-items: stretch;
}

.example-wrapper__pane {
    width: 0;
    flex-grow: 1;
    overflow: scroll;
}
.example-wrapper__log-text {
    margin: 8px;
}
.example-wrapper__separator {
    align-self: stretch;
    margin: 8px;
    width: 1px;
    flex-grow: 0;
    background-color: gray;
}
.example-wrapper__footer {
    box-sizing: border-box;
    height: 40px;
    padding: 8px;
    display: flex;
    align-items: center;
}
</style>