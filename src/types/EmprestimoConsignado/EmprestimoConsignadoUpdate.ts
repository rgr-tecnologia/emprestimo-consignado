import { EmprestimoConsignadoResponse } from "./EmprestimoConsignadoResponse";

export type EmprestimoConsignadoUpdate = Omit<
  EmprestimoConsignadoResponse,
  "Id"
>;
