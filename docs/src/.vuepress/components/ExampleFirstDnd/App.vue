<template>
    <Box></Box>
    <Ball index="a ball"></Ball>
</template>
    
<script setup lang='ts'>
import Ball from './Ball.vue';
import Box from './Box.vue';
import { useHtmlProvider } from '@mmis1000/vue-dnd'
useHtmlProvider()
</script>
<style>

</style>