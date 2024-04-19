import { Departamento } from "../Departamento/Departamento";

export type Colaborador = {
  Id: number;
  NomeColaborador: string;
  Email: string;
  Telefone: string;
  Departamento: Departamento;
};
