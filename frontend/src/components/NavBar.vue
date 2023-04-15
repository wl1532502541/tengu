<template>
  <div class="nav-container">
    <ImageButton :icon="addConn" @click="handleAddClick" />
    <AddConnectModal v-model="showAddModal" />
  </div>
</template>
    
<script setup lang='ts'>
import addConn from '../assets/images/add_conn.png'
import { WindowIsFullscreen } from '../../wailsjs/runtime/runtime'



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

</script>
    
<style lang="less">
.nav-container {
  background-color: white;
  display: flex;
  align-items: center;
  padding: v-bind(paddingTop) 10px 5px 10px;
}
</style>



