<template>
  <div class="nav-container">
    <ImageButton :icon="addConn" @click="handleAddClick" />
    <el-divider direction="vertical" />
    <ImageButton :icon="sqlScript" text="SQL" @click="handleAddSql" />
    <AddConnectModal v-model="showAddModal" />
  </div>
</template>
    
<script setup lang='ts'>
import addConn from '../assets/images/add_conn.png'
import sqlScript from '../assets/images/sql_script.png'
import { WindowIsFullscreen } from '../../wailsjs/runtime/runtime'
import { useWorkTabStore } from '../store/work-tab';
import SqlEditor from './SqlEditor.vue'

const workTabStore = useWorkTabStore();


const paddingTop = ref("25px");
const showAddModal = ref(false)


onMounted(() => {
  window.onresize = async () => {
    const isFullScreen = await WindowIsFullscreen()
    if (isFullScreen) {
      paddingTop.value = "10px"
    } else {
      paddingTop.value = "25px"
    }
  };
});

const handleAddClick = () => {
  showAddModal.value = true;
}

const handleAddSql = () => {
  const workTab = {
    name: `untitled`,
    component: shallowRef(SqlEditor),
    id: `${workTabStore.workTabList.length + 1}`,
    closeable: true,
    icon: sqlScript
  }
  workTabStore.addWorkTab(workTab)
  workTabStore.setCurrentWorkTab(workTab)
  workTabStore.setCurrentWorkTabId(workTab.id)
}

</script>
    
<style lang="less">
.nav-container {
  background-color: white;
  display: flex;
  align-items: center;
  padding: v-bind(paddingTop) 10px 5px 10px;
}
</style>



