<template>
    <el-tabs type="card" :active-name="activeName">
        <el-tab-pane v-for="item in workTabStore.workTabList" :label="item.name" :name="item.id">
            <component :is="item.component" />
        </el-tab-pane>

    </el-tabs>
</template>
    
<script setup lang='ts'>
import { useWorkTabStore } from '../store/work-tab';

const activeName = ref('1');
const workTabStore = useWorkTabStore();

</script>
    
<style lang="less">
.el-tabs__header {
    height: 40px;
    background-color: #f6f8fa;
    margin: 0px;
    border-bottom: 1px solid #f6f8fa;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
}

.el-tabs__item.is-top.is-active {
    background-color: white !important;

}
</style>