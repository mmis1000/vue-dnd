<template>
    <Component :is="provider === 'html' ? HtmlProvider : PointerEventProvider">
        <Box></Box>
        <Ball index="a ball"></Ball>
    </Component>
</template>
    
<script setup lang='ts'>
import Ball from './Ball.vue';
import Box from './Box.vue';
import { HtmlProvider, PointerEventProvider } from '@mmis1000/vue-dnd'
import { PropType } from 'vue';

defineProps({
    provider: {
        type: String as unknown as PropType<'html' | 'pointer'>,
        default: 'html'
    }
})
</script>
<style>

</style>