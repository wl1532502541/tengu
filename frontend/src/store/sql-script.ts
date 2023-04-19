import { defineStore } from "pinia";

export interface SqlScript {
  fileName: string
  filePath: string
  sql: string
}
export interface SqlScriptState {
  sqlSqcriptList: SqlScript[]
  current: SqlScript | null
}

export const useSqlScriptStore = defineStore("sql-script", {
  state: (): SqlScriptState => {
    return {
      sqlSqcriptList: [
      ],
      current: null
    };
  },
  actions: {
    setList(sqlSqcriptList: SqlScript[]) {
      this.sqlSqcriptList = sqlSqcriptList;
    },
    setCurrent(sqlScript: SqlScript | null) {
      this.current = sqlScript
    },
    add(sqlScript: SqlScript) {
      this.sqlSqcriptList.push(sqlScript);
    },
    findByFilePath(path: string) {
      const sql = this.sqlSqcriptList.find((s) => s.filePath === path)
      if (sql) {
        return sql
      } else {
        return null
      }
    },
    findAndSetByFilePath(path: string) {
      const sql = this.sqlSqcriptList.find((s) => s.filePath === path)
      if (sql) {
        this.setCurrent(sql)
        return true
      } else {
        return false
      }
    }
  },
});
