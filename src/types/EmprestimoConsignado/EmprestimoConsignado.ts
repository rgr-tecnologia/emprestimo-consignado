import { Colaborador } from "../Colaborador/Colaborador";
import { Status } from "../Status/Status";

export type EmprestimoConsignado = {
  Colaborador: Colaborador;
  ValorTotalEmprestimo: string;
  ValorParcela: string;
  QuantidadeParcelas: number;
  Status: Status;
  JustificativaRH?: string;
};
