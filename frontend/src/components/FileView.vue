<template>
    <div class="file-view-container">
        <el-scrollbar>
            <el-tree :data="sqlScriptStore.sqlSqcriptList" node-key="fileName" @node-click="handleNodeClick" highlight-current
                :expand-on-click-node="false">
                <template #default="{ node, data }">
                    <div class="file-node-container" @dblclick="() => handleDbClick(data, node)">
                        <SvgIcon :name="'sql-script'" class="sql-script-icon"/>
                        <el-tooltip effect="light" :content="data.filePath" placement="top">
                            <span class="file-text">{{ data.fileName }}</span>
                        </el-tooltip>
                    </div>
                </template>
            </el-tree>
        </el-scrollbar>
    </div>
</template>
    
<script setup lang='ts'>
import { TreeNode } from 'element-plus';
import { GetStorage } from '../../wailsjs/go/main/App';
import { SqlScript } from '../store/sql-script';
import { useSqlScriptStore } from '../store/sql-script';
import { useWorkTabStore } from '../store/work-tab';
import SqlEditor from './SqlEditor.vue';
import sqlScriptImg from '../assets/images/sql_script.png'

const sqlScriptStore = useSqlScriptStore()
const Cnt = ref(0)
onMounted(async () => {
    const storage = await GetStorage('sql-script')
    if (storage) {
        sqlScriptStore.setList(JSON.parse(storage))
        Cnt.value = JSON.parse(storage).length
    }
});

const workTabStore = useWorkTabStore()
const handleNodeClick = (sqlScript:SqlScript,node:TreeNode)=>{
    sqlScriptStore.setCurrent(sqlScript)
}
const handleDbClick = (sqlScript:SqlScript,node:TreeNode)=>{
    if(!workTabStore.findAndSetById(sqlScript.fileName)){
        workTabStore.addWorkTab({
          id: sqlScript.fileName,
          name: sqlScript.fileName,
          component: shallowRef(SqlEditor),
          closeable: true,
          icon: sqlScriptImg,
        })        
    }
}
</script>
    
<style lang="less">
.file-view-container {
    padding: 10px;
    background-color: white;
    width: 250px;
    border-radius: 10px;
    height: 32vh;
    box-shadow: 2px 2px 10px rgba(90, 89, 89, 0.2);
    .file-node-container {
        display: flex;
        align-items: center;
        font-size: 16px;
        width: 100%;
        -webkit-user-select: none;
        user-select: none;
        .sql-script-icon {
            margin-right: 10px;
            width: 15px;
            height: 15px;
        }
        .file-text {
            width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>