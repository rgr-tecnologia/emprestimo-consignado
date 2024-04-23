import { Status } from "../Status/Status";

export type EmprestimoConsignadoResponse = {
  Id: number;
  ColaboradorId: number;
  ValorTotalEmprestimo: string;
  ValorParcela: string;
  QuantidadeParcelas: number;
  Status: Status;
  JustificativaRH?: string;
};
