import { defineStore } from "pinia";
import { DBConn, TenguConn } from "../type/conn";

export interface ConnState {
  connList: DBConn[];
  openedConnList: TenguConn[];
  currentConn: TenguConn | null;
}

export const useConnStore = defineStore("conn", {
  state: (): ConnState => {
    return {
      connList: [],
      openedConnList: [],
      currentConn: null,
    };
  },
  actions: {
    setConnList(connList: DBConn[]) {
      this.connList = connList;
    },
    setOpenedConnList(openedConnList: TenguConn[]) {
      this.openedConnList = openedConnList;
    },
    setCurrentConn(currentConn: TenguConn) {
      this.currentConn = currentConn;
    },
    addConn(conn: DBConn) {
      this.connList.push(conn);
    },
  },
});
