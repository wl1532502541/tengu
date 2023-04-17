<template>
    <div class="image-btn-container" @click="handleClick">
        <img :src="icon" class="image">
        <span v-if="text">{{ text }}</span>
    </div>
</template>
    
<script setup lang='ts'>

interface Props {
    icon: string
    text?: string
}

defineProps<Props>()
const emit = defineEmits(['click'])

const handleClick = () => {
    emit('click')
}

</script>
    
<style lang="less">
.image-btn-container {
    cursor: pointer;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: rgb(236, 236, 236);
        border-radius: 5px;
    }

    span {
        margin-left: 10px;
        font-size: 14px;
    }

    .image {
        width: 18px;
        height: 18px;
    }
}
</style>

