import { EmprestimoConsignadoResponse } from "./EmprestimoConsignadoResponse";

export type EmprestimoConsignadoCreate = Omit<
  EmprestimoConsignadoResponse,
  "Id"
>;
