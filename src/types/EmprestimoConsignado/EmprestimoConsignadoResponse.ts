import { Status } from "../Status/Status";

export type EmprestimoConsignadoResponse = {
  Id: number;
  Author?: any;
  ColaboradorId: number;
  ValorTotalEmprestimo: string;
  ValorParcela: string;
  QuantidadeParcelas: number;
  Status: Status;
  JustificativaRH?: string;
  AuthorId: number;
};
