import { defineStore } from "pinia";

export interface SqlScript {
  fileName: string
  filePath: string
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
    setCurrent(sqlScript: SqlScript) {
      this.current = sqlScript
    },
    add(sqlScript: SqlScript) {
      this.sqlSqcriptList.push(sqlScript);
    },
  },
});
