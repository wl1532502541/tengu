<template>
    <div class="sql-editor-container" ref="container">
        <div class="tool-bar">
            <SvgIcon name="run" class="run-icon" size="24px" @click="runSql" />
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
import { Query } from '../../wailsjs/go/main/App';
import { ElMessage } from 'element-plus';
import { QueryResult } from '../type/query-result';

const connStore = useConnStore()

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
            // 相关颜色属性配置
            // 'editor.foreground': '#000000',
            'editor.background': '#f6f8fa',     //背景色
            // 'editorCursor.foreground': '#8B0000',
            // 'editor.lineHighlightBackground': '#0000FF20',
            // 'editorLineNumber.foreground': '#008800',
            // 'editor.selectionBackground': '#88000030',
            // 'editor.inactiveSelectionBackground': '#88000015'
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

        .run-icon {
            cursor: pointer;
        }
    }


    .editor {
        width: 100%;
        flex: 1;
        // border-bottom-left-radius: 10px;
        // border-bottom-right-radius: 10px;
    }

    .result-container {
        flex: 1;

        .result-table {}
    }
}

// .el-table .cell {
//     white-space: nowrap;
//     display: inline-block;
// }
</style>