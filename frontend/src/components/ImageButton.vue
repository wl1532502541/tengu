<template>
    <div class="image-btn-container" @click="handleClick">
        <img :src="icon" class="image">
    </div>
</template>
    
<script setup lang='ts'>

interface Props {
    icon: string
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
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        background-color: rgb(236, 236, 236);
        border-radius: 5px;
    }

    .image {
        width: 20px;
        height: 20px;
    }
}
</style>

