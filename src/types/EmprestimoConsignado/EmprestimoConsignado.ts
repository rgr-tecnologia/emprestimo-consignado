import { Colaborador } from "../Colaborador/Colaborador";

export type EmprestimoConsignado = {
  Colaborador: Colaborador;
  ValorTotalEmprestimo: number;
  ValorParcela: number;
  QuantidadeParcelas: number;
};
