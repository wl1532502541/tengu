import { defineStore } from "pinia";
import SqlEditor from "../components/SqlEditor.vue";

export interface WorkTab {
  id: string;
  name: string;
  component: Component | null;
  closeable: boolean;
  icon: string | null;
}
export interface WorkTabState {
  workTabList: WorkTab[];
  currentWorkTab: WorkTab | null;
  currentWorkTabId: string;
}

export const useWorkTabStore = defineStore("work-tab", {
  state: (): WorkTabState => {
    return {
      workTabList: [
        {
          id: "1",
          name: "Object",
          component: null,
          closeable: false,
          icon: null,
        },
      ],
      currentWorkTab: null,
      currentWorkTabId: "1",
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
    setCurrentWorkTabId(currentWorkTabId: string) {
      this.currentWorkTabId = currentWorkTabId;
    },
  },
});
