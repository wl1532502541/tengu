export interface QueryResult {
  IsErr: boolean;
  ErrMsg: string;
  Columns: string[];
  Rows: string[][];
}
