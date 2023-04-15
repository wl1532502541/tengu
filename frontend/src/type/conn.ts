export interface DBConn {
  type: string;
  connectionName: string;
  host: string;
  port: string;
  userName: string;
  password: string;
}

export interface TenguConn {
  id: string;
  name: string;
  parentName: string;
  type: string;
  isOpen: boolean;
  dsn: string;
  connType: string;
  children: TenguConn[];
}
