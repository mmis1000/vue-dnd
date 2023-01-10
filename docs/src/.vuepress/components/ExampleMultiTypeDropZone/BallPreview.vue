<template>
    <div
        class="ball"
    >
        preview
    </div>
</template>
<script setup lang='ts'>
defineProps({
    index: {
        type: String,
        required: true,
    }
});
</script>
<style scoped>
.ball {
    background: #205d18;
    border-radius: 20px;
    height: 40px;
    width: 40px;
    margin: 5px;
    line-height: 40px;
    position: relative;
    z-index: 1;
}
.ball--dragging {
    opacity: 50%;
}
</style>