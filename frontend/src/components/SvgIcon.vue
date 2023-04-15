<template>
    <svg aria-hidden="true" :class="[$attrs.class, 'svg-icon']" :style="getStyle">
        <use :href="symbolId" :fill="color" />
    </svg>
</template>

    
<script setup lang='ts'>
import { CSSProperties } from 'vue';

const props = defineProps({
    prefix: {
        type: String,
        default: 'icon'
    },
    name: {
        type: String,
        required: true
    },
    size: {
        type: [Number, String],
        default: 16
    },
    color: {
        type: String,
        default: ''
    },
})


const symbolId = computed(() => `#${props.prefix}-${props.name}`)

const getStyle = computed((): CSSProperties => {
    const { size } = props
    let s = `${size}`
    s = `${s.replace('px', '')}px`
    return {
        width: s,
        height: s
    }
})
</script>
    
<style>
.svg-icon {
    display: inline-block;
    overflow: hidden;
    vertical-align: -0.15em;
    fill: currentColor;
}
</style>


