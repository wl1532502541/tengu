<template>
    <div class="sql-editor-container" ref="container">
        <div class="tool-bar">
            <el-tooltip effect="light" content="save" placement="top" :show-arrow="false">
                <SvgIcon name="save" class="save-icon" size="24px" @click="saveSql" />
            </el-tooltip>
            <el-tooltip effect="light" content="run" placement="top" :show-arrow="false">
                <SvgIcon name="run" class="run-icon" size="24px" @click="runSql" />
            </el-tooltip>
        </div>
        <div ref="editor" class="editor"></div>
        <div class="result-container" v-if="result.columns.length">
            <el-table class="result-table" border table-layout="auto" :data="result.data" :height="tableHeight">
                <el-table-column v-for="item in result.columns" :prop="item" :label="item" :key="item" min-width="200px" />
            </el-table>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import * as monaco from 'monaco-editor';
import { useConnStore } from '../store/conn';
import { SqlScript, useSqlScriptStore } from '../store/sql-script'
import { Query, SaveFileDialog,GetFileNameByFilePath } from '../../wailsjs/go/main/App';
import { ElMessage } from 'element-plus';
import { QueryResult } from '../type/query-result';
import { GetStorage } from '../../wailsjs/go/main/App';
import { SaveStorage } from '../../wailsjs/go/main/App';
import { WorkTab, useWorkTabStore } from '../store/work-tab';


const connStore = useConnStore()

const workTabStore = useWorkTabStore()

const editor = ref();

const editorConntent = ref('');

const container = ref()

interface IResult {
    columns: string[]
    data: any[]
}

const result = reactive<IResult>({
    columns: [],
    data: []
})

watch(() => result.data, () => {
    nextTick().then(() => {
        const height = (container.value.clientHeight - 40) / 2
        tableHeight.value = `${height}px`
        instance.getDomNode()!.style!.height = `${height}px`
        instance.layout()
    })
})

const tableHeight = ref('10px')

let instance: monaco.editor.IStandaloneCodeEditor;

onMounted(() => {
    debugger
    nextTick().then(() => {
        const height = (container.value.clientHeight - 40) / 2
        tableHeight.value = `${height}px`
    })

    window.addEventListener('resize', () => {
        nextTick().then(() => {
            const height = (container.value.clientHeight - 40) / 2
            tableHeight.value = `${height}px`
        })
    })

    const modal = monaco.editor.createModel(editorConntent.value, 'sql');

    monaco.editor.defineTheme('customerVs', {
        base: 'vs',
        inherit: true,
        rules: [{ token: '', background: '#f6f8fa' }],
        colors: {
            'editor.background': '#f6f8fa',     //背景色
        }
    });

    monaco.editor.setTheme('customerVs');

    instance = monaco.editor.create(editor.value, {
        model: modal,
        tabSize: 2,
        automaticLayout: true,
        overviewRulerBorder: true, // 是否应围绕概览标尺绘制边框
        scrollBeyondLastLine: false,
        minimap: { // 关闭代码缩略图
            enabled: false // 是否启用预览图
        },
    });
    const sqlCurrent = sqlScriptStore.current
    if (sqlCurrent) {
        instance.setValue(sqlCurrent.sql)
        debugger
    }

    // document.addEventListener("keydown", (e) => {
    //     console.log(e)
    // })



    // instance.onDidChangeModelContent(() => {
    //     console.log(connStore.currentConn?.dsn)
    //     // const value = instance.getValue();
    //     // emit('update:modelValue', value);
    // });
});


const runSql = async () => {
    const sql = instance.getValue()
    if (!connStore.currentConn) {
        ElMessage.warning("please  select conn fisrt")
        return
    }
    const resStr = await Query(connStore.currentConn.connType, connStore.currentConn.dsn, sql)
    const res: QueryResult = JSON.parse(resStr)
    if (res.IsErr) {
        ElMessage.error(res.ErrMsg)
        return
    }
    result.columns = res.Columns

    const data: any[] = []
    res.Rows.forEach((item: any) => {
        const obj: any = {}
        res.Columns.forEach((col: string, index: number) => {
            obj[col] = item[index]
        })
        data.push(obj)
    })
    result.data = data
}

const sqlScriptStore = useSqlScriptStore()
const saveSql = async () => {
    const sqlScriptContent = instance.getValue()
    try {
        let sqlScriptList: SqlScript[] = [];
        const storage = await GetStorage('sql-script')
        if (storage) {
            sqlScriptList = JSON.parse(storage)
        }

        const exitSql = sqlScriptStore.findByFilePath(workTabStore.currentWorkTabId)
        if (exitSql) {
            exitSql.sql = instance.getValue()
            await SaveStorage('sql-script', JSON.stringify(sqlScriptStore.sqlSqcriptList))
            ElMessage.success("save sql script success!")
            return
        }

        let saveFileName = workTabStore.currentWorkTab?.name as string
        //获取最后一个.的位置
        let index = saveFileName.lastIndexOf(".");
        if (index === -1) {
            saveFileName = saveFileName + ".sql"
        }
        const sqlScriptPath = await SaveFileDialog(saveFileName, "Save sql script", sqlScriptContent)
        const fileName = await GetFileNameByFilePath(sqlScriptPath)
        if (!fileName) {
            // 说明取消了保存
            return
        }

        const newSqlScript = { fileName: fileName as string, filePath: sqlScriptPath, sql: instance.getValue() }
        sqlScriptList.push(newSqlScript)
        sqlScriptStore.setCurrent(newSqlScript)
        // 存入storage
        await SaveStorage('sql-script', JSON.stringify(sqlScriptList))
        // 存入store
        sqlScriptStore.setList(sqlScriptList)

        // 保存新文件成功后把当前untitled换成返回的名字 todo 这里有点问题
        const currentWorkTab = workTabStore.currentWorkTab as WorkTab
        currentWorkTab.name = fileName as string
        currentWorkTab.id = sqlScriptPath
        workTabStore.setCurrentWorkTabId(sqlScriptPath)
    } catch (e) {
        console.log('save sql error:', e)
        ElMessage.error("save sql error:" + e)
    }
}

</script>
    
<style lang="less">
.sql-editor-container {
    padding: 0px 0px 0px 3px;
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 84vh;

    .tool-bar {
        padding: 0px 20px;
        height: 40px;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: end;
        gap: 20px;

        .run-icon {
            cursor: pointer;
        }

        .save-icon {
            cursor: pointer;
        }

    }


    .editor {
        width: 100%;
        flex: 1;
    }

    .result-container {
        flex: 1;

        .result-table {}
    }
}
</style>