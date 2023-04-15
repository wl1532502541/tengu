import { defineStore } from "pinia";
import SqlEditor from "../components/SqlEditor.vue";

export interface WorkTab {
  id: string;
  name: string;
  component: Component;
  closeable: boolean;
}
export interface WorkTabState {
  workTabList: WorkTab[];
  currentWorkTab: WorkTab | null;
}

export const useWorkTabStore = defineStore("work-tab", {
  state: (): WorkTabState => {
    return {
      workTabList: [
        {
          id: "1",
          name: "Untitled",
          component:shallowRef(SqlEditor),
          closeable: false,
        },
      ],
      currentWorkTab: null,
    };
  },
  actions: {
    setWorkTabList(workTabList: WorkTab[]) {
      this.workTabList = workTabList;
    },
    setCurrentWorkTab(currentWorkTab: WorkTab) {
      this.currentWorkTab = currentWorkTab;
    },
    addWorkTab(workTab: WorkTab) {
      this.workTabList.push(workTab);
    },
  },
});
