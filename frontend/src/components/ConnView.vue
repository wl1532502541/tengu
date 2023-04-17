<template>
    <div class="conn-view-container">
        <el-scrollbar>
            <el-tree :data="connStore.openedConnList" node-key="name" @node-click="handleNodeClick" highlight-current
                :expand-on-click-node="false">
                <template #default="{ node, data }">
                    <div class="tree-node-container" @dblclick="() => handleDbClick(data, node)">
                        <SvgIcon :name="getIcon(data.type)" class="tree-icon" :color="getColor(data)" />
                        <el-tooltip effect="light" :content="data.name" placement="top">
                            <span class="tree-text">{{ data.name }}</span>
                        </el-tooltip>
                    </div>
                </template>
            </el-tree>
        </el-scrollbar>
    </div>
</template>
    
<script setup lang='ts'>
import { onMounted, reactive } from 'vue';
import { GetStorage, Query } from '../../wailsjs/go/main/App';
import { ElMessage, TreeNode } from 'element-plus';
import { QueryResult } from '../type/query-result'
import { useConnStore } from '../store/conn';
import { TenguConn } from '../type/conn';

const connStore = useConnStore();



onMounted(async () => {
    const storage = await GetStorage('conn')
    if (storage) {
        connStore.setConnList(JSON.parse(storage))
    }
    const _treeData = connStore.connList.map(conn => ({ id: conn.connectionName, name: conn.connectionName, type: `conn_${conn.type}`, isOpen: false, children: [], parentName: '', dsn: `${conn.userName}:${conn.password}@tcp(${conn.host}:${conn.port})/`, connType: conn.type }))
    connStore.setOpenedConnList(_treeData)
});


const getIcon = (type: string) => {
    if (type.indexOf('conn') > -1) {
        return 'mysql'
    } else if (type === 'db') {
        return 'db'
    } else if (type === 'tableCollect' || type === 'table') {
        return "table"
    }
    return '';
}

const getColor = (data: TenguConn) => {
    let color = "grey";
    if (data.type.indexOf('conn') > -1 && data.isOpen) {
        color = "#409EFF"
    } else if (data.type === 'db' && data.isOpen) {
        color = "green"
    } else if (data.type === 'table' || data.type === 'tableCollect') {
        color = "#409EFF"
    }
    return color
}

const handleDbClick = async (data: TenguConn, node: TreeNode) => {
    if (data.type.indexOf('conn') > -1) {
        if (!data.isOpen) {
            await getDataBases(data)
            node.expanded = true
        }

    } else if (data.type === 'db') {
        if (!data.isOpen) {
            await getTables(data)
            node.expanded = true
        }
    }
    connStore.setCurrentConn(data)

}


const handleNodeClick = async (data: TenguConn, node: TreeNode) => {
    connStore.setCurrentConn(data)
}

const getTables = async (data: TenguConn) => {
    const treeData = connStore.openedConnList
    const resStr = await Query(data.connType, data.dsn, 'SHOW TABLES;')
    const res: QueryResult = JSON.parse(resStr);
    if (res.IsErr) {
        ElMessage.error(res.ErrMsg)
        return
    }
    const parent = treeData.find(item => item.name == data.parentName)
    if (parent) {
        const current = parent.children.find(item => item.name == data.name)
        if (current) {
            current.isOpen = true
            const rows = res.Rows;
            const table: TenguConn = {
                id: `${parent.name}_${current.name}_tableCollect`,
                name: "Tables",
                dsn: data.dsn,
                connType: data.connType,
                parentName: current.name,
                type: 'tableCollect',
                isOpen: true,
                children: []
            };
            if (rows.length) {
                rows.forEach(item => {
                    if (item.length > 0) {
                        table.children.push({
                            id: `${current.name}_${item[0]}`,
                            name: item[0],
                            dsn: data.dsn,
                            connType: data.connType,
                            parentName: "Tables",
                            type: 'table',
                            isOpen: true,
                            children: []
                        })
                    }
                })
            }
            current.children.push(table);
            connStore.setOpenedConnList(treeData)
        }
    }
}

const getDataBases = async (data: TenguConn) => {
    debugger
    const treeData = connStore.openedConnList
    const resStr = await Query(data.connType, data.dsn, 'show databases;')
    const res: QueryResult = JSON.parse(resStr);
    if (res.IsErr) {
        ElMessage.error(res.ErrMsg)
        return
    }

    const current = treeData.find(item => item.name == data.name)
    if (current) {
        current.isOpen = true
        const rows = res.Rows;
        if (rows.length) {
            rows.forEach(item => {
                if (item.length > 0) {
                    current.children.push({
                        dsn: `${data.dsn}${item[0]}`,
                        connType: data.connType,
                        id: `${current.name}_${item[0]}`,
                        name: item[0],
                        parentName: current.name,
                        type: 'db',
                        isOpen: false,
                        children: []
                    })
                }
            })
        }
        connStore.setOpenedConnList(treeData)
    }
}

</script>
    
<style lang="less">
.conn-view-container {
    padding: 10px;
    background-color: white;
    width: 250px;
    border-radius: 10px;
    height: 50vh;
    box-shadow: 2px 2px 10px rgba(90, 89, 89, 0.2);


    .tree-node-container {
        display: flex;
        align-items: center;
        font-size: 16px;
        width: 100%;
        -webkit-user-select: none;
        user-select: none;


        .tree-icon {
            margin-right: 10px;
            width: 15px;
            height: 15px;
        }

        .tree-text {
            width: 130px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }


}
</style>