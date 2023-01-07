<template>
    <div class="example-wrapper__container">
        <div class="example-wrapper__title">
            {{ title }}
            <a v-if="source != null" :href="source" target="_blank">Source</a>
        </div>
        <div class="example-wrapper__pane-wrapper">
            <div class="example-wrapper__pane">
                <template v-for="item of mappedOptions" :key="item.name">
                    <label v-for="option of item.options">
                        <input type="radio" :value="option.value" v-model="item.value.value">
                        {{ option.text }}
                    </label>
                    <br>
                </template>
                <template v-if="mounted">
                    <slot v-bind="joinedOptions"></slot>
                </template>
            </div>
            <div v-show="logPane" class="example-wrapper__separator"></div>
            <div v-show="logPane" class="example-wrapper__pane">
                <div v-for="text of logs" :key="text" class="example-wrapper__log-text">
                    {{ text }}
                </div>
            </div>
        </div>
        <div class="example-wrapper__footer">
            <button
                class="example-wrapper__footer-button"
                :class="{ 'example-wrapper__footer-button--active': logPane }"
                @click="logPane = !logPane"
            >Log</button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, PropType, reactive, ref } from 'vue';
import { useLoggerParent } from './example-util';

interface OptionRadio<T> {
    name: string,
    type: 'radio',
    value: T,
    options: { text: string, value: T }[]
}

const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    clientOnly: {
        type: Boolean,
        default: false
    },
    source: {
        type: String,
        default: null
    },
    options: {
        type: Array as unknown as PropType<OptionRadio<any>[]>,
        default: () => []
    }
})
const valueStore = reactive({} as Record<string, string>)
const mappedOptions = computed(() => {
    return props.options.map(o => {
        if (o.type === 'radio') {
            return {
                name: o.name,
                type: 'radio',
                value: computed<string>({
                    get: () => {
                        return valueStore[o.name] ?? o.value
                    },
                    set: (v) => {
                        valueStore[o.name] = v
                    }
                }),
                options: o.options
            }
        } else {
            throw new Error('unknown type')
        }
    })
})
const joinedOptions = computed(() => {
    return Object.fromEntries(mappedOptions.value.map(i => [i.name, i.value.value]))
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

const logPane = ref(true)
</script>
<style scoped>
.example-wrapper__container {
    margin: 0.85rem 0;
    background-color: var(--code-bg-color);
    border-radius: 6px;
    box-sizing: border-box;
    color: #eee;
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
    height: 240px;
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

.example-wrapper__footer-button {
    padding: 0.15em 0.85em;
    border-radius: 6px;
    color: gray;
    border: 1px solid gray;
}
.example-wrapper__footer-button--active {
    padding: 0.15em 0.85em;
    border-radius: 6px;
    color: #333;
    border: 1px solid #eee;
    background: #eee;
}
</style>