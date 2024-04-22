export type EmprestimoConsignadoResponse = {
  Id: number;
  ColaboradorId: number;
  ValorTotalEmprestimo: number;
  ValorParcela: number;
  QuantidadeParcelas: number;
  Status: JobItemStatus;
};

export type JobItemStatus = "Em analise" | "Cancelado" | "Aprovado" | "Rejeitado"
