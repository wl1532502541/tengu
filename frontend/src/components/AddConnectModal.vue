<template>
    <el-dialog v-model="show" title="New Connection" @close="reset">
        <el-form label-width="150px" label-suffix=":" :model="conn" ref="ruleFormRef">
            <el-form-item label="Connection Name" prop="connectionName">
                <el-input v-model="conn.connectionName" />
            </el-form-item>
            <el-form-item label="Host" prop="host">
                <el-input v-model="conn.host" />
            </el-form-item>
            <el-form-item label="Port" prop="port">
                <el-input v-model="conn.port" />
            </el-form-item>
            <el-form-item label="User Name" prop="userName">
                <el-input v-model="conn.userName" />
            </el-form-item>
            <el-form-item label="Password" prop="password">
                <el-input show-password type="password" v-model="conn.password" />
            </el-form-item>
        </el-form>
        <template #footer>
            <el-row justify="space-between">
                <el-col :span="6">
                    <el-button @click="handleTestConnectionClick">
                        Test Connection
                        <p class="test-result" :style="`background-color:${testResColor}`" v-if="showTestResult"></p>
                    </el-button>
                </el-col>
                <el-col :span="12">
                    <el-button @click="closeModal">Cancel</el-button>
                    <el-button type="primary" @click="handleSaveClick">
                        Save
                    </el-button>
                </el-col>
            </el-row>

        </template>
    </el-dialog>
</template>
    
<script setup lang='ts'>
import { GetStorage, SaveStorage, TestConnect } from '../../wailsjs/go/main/App';
import { ElMessage, FormInstance } from 'element-plus'
import { DBConn } from '../type/conn';
import { useConnStore } from '../store/conn';

const connStore = useConnStore();

const ruleFormRef = ref<FormInstance>()

const show = ref(false);
const testResColor = ref('rgba(0,0,0,0)')
const showTestResult = ref(false)

interface Props {
    modelValue: boolean
}


const conn = reactive<DBConn>({
    connectionName: '',
    host: '127.0.0.1',
    port: '3306',
    userName: '',
    password: '',
    type: 'mysql'
})



const props = withDefaults(defineProps<Props>(), {
    modelValue: false
})

const emit = defineEmits(['update:modelValue'])

watch(() => props.modelValue, (newValue) => {
    show.value = newValue;
})

watch(show, () => {
    emit('update:modelValue', show.value)
})

const closeModal = () => {
    show.value = false;
}

const reset = () => {
    showTestResult.value = false
    testResColor.value = 'rgba(0,0,0,0)'
    conn.type = 'mysql';
    ruleFormRef.value?.resetFields()
}

const handleTestConnectionClick = async () => {
    const dsn = `${conn.userName}:${conn.password}@tcp(${conn.host}:${conn.port})/`;
    const errMsg = await TestConnect(conn.type, dsn)
    testResColor.value = !errMsg ? 'rgb(85, 172, 246)' : 'red'
    showTestResult.value = true
    if (errMsg) {
        ElMessage.error(`connnection error: ${errMsg}`)
    } else {
        ElMessage.success('connnection success !')
    }
}


const handleSaveClick = async () => {
    let connList: DBConn[] = [];
    const storage = await GetStorage('conn')
    if (storage) {
        connList = JSON.parse(storage);
    }
    if (!conn.connectionName) {
        conn.connectionName = `${conn.host}_${conn.port}`
    }

    const exit = connList.find(item => item.connectionName == conn.connectionName)
    if (exit) {
        ElMessage.error("Connection name is exit!Please rename")
        return
    }

    connList.push(conn)
    const res = await SaveStorage("conn", JSON.stringify(connList))
    if (!res) {
        ElMessage.error("Save error! Please retry.")
        return
    }

    connStore.addConn(conn)
    closeModal()
}








</script>
    
<style lang="less">
.el-dialog {
    border-radius: 10px;
}

.test-result {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: 10px;
}
</style>