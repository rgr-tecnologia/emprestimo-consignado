import { Departamento } from "../Departamento/Departamento";
import { Filial } from "../Filial/Filial";

export type Colaborador = {
  Id: number;
  NomeColaborador: string;
  Email: string;
  Telefone: string;
  Departamento: Departamento;
  Filial: Filial;
  
};
