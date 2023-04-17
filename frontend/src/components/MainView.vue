<template>
    <el-tabs type="card" :active-name="workTabStore.currentWorkTabId" @tab-remove="removeTab">
        <el-tab-pane v-for="item in workTabStore.workTabList" :name="item.id" :closable="item.closeable">
            <template #label>
                <span class="custom-tabs-label">
                    <img :src="item.icon!" v-if="item.icon">
                    <span>{{ item.name }}</span>
                </span>
            </template>
            <component :is="item.component" v-if="item.component" />
        </el-tab-pane>

    </el-tabs>
</template>
    
<script setup lang='ts'>
import { TabPaneName } from 'element-plus';
import { useWorkTabStore } from '../store/work-tab';


const workTabStore = useWorkTabStore();

const removeTab = (targetId: TabPaneName) => {
    targetId = targetId as string
    let tabWorks = workTabStore.workTabList;
    if (targetId === workTabStore.currentWorkTabId) {
        tabWorks.forEach((tab, index) => {
            if (tab.id === targetId) {
                const nextTab = tabWorks[index + 1] || tabWorks[index - 1]
                if (nextTab) {
                    workTabStore.setCurrentWorkTabId(nextTab.id)
                }
            }
        })
    }
    tabWorks = tabWorks.filter((tab) => tab.id !== targetId)
    workTabStore.setWorkTabList(tabWorks)
}

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

.custom-tabs-label {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
        width: 14px;
        height: 14px;
        margin-right: 5px;
    }
}
</style>