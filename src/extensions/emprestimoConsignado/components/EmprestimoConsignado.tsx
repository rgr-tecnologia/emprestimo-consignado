import * as React from "react";
import {
  ComboBox,
  PrimaryButton,
  Stack,
  StackItem,
  TextField,
} from "@fluentui/react";
import { EmprestimoConsignado } from "../../../types/EmprestimoConsignado/EmprestimoConsignado";

export interface EmprestimoConsignadoProps {
  initialValue: EmprestimoConsignado;
  onSave: (data: EmprestimoConsignadoProps["initialValue"]) => Promise<void>;
  onClose: () => void;
}

export default function EmprestimoConsignado(
  props: EmprestimoConsignadoProps
): JSX.Element {
  const { initialValue, onSave, onClose } = props;
  const [formValues, setFormValues] =
    React.useState<EmprestimoConsignado>(initialValue);

  function onChangeValorEmprestimo(value: string | undefined): void {
    if (!value) {
      return;
    }
    setFormValues((prev) => ({
      ...prev,
      ValorTotalEmprestimo: Number(value),
      ValorParcela: Number(value) / Number(formValues.QuantidadeParcelas),
    }));
  }

  function onChangeQuantidadeParcelas(value: number): void {
    setFormValues((prev) => ({
      ...prev,
      QuantidadeParcelas: value,
      ValorParcela: prev.ValorTotalEmprestimo / Number(value),
    }));
  }

  const QuantidadeParcelasOptions = new Array(12)
    .fill(0)
    .map((_: never, index: number) => ({
      key: (index + 1).toString(),
      text: (index + 1).toString(),
    }));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Stack tokens={{ childrenGap: 10, padding: 20 }}>
        <StackItem>
          <Stack horizontal>
            <StackItem>
              <TextField
                label="Nome do colaborador"
                value={formValues.Colaborador.NomeColaborador}
                readOnly={true}
                borderless
              />
            </StackItem>
            <StackItem>
              <TextField
                label="Departamento do colaborador"
                value={formValues.Colaborador.Departamento.Title}
                readOnly={true}
                borderless
              />
            </StackItem>
          </Stack>
        </StackItem>

        <StackItem>
          <Stack
            horizontal
            tokens={{
              childrenGap: 10,
            }}
          >
            <StackItem>
              <TextField
                label="Valor total do empréstimo"
                value={formValues.ValorTotalEmprestimo.toString()}
                onChange={(
                  e: React.FormEvent<HTMLInputElement>,
                  value: string
                ) => onChangeValorEmprestimo(value)}
              />
            </StackItem>
            <StackItem>
              <ComboBox
                label="Quantidade de parcelas"
                selectedKey={formValues.QuantidadeParcelas.toString()}
                options={QuantidadeParcelasOptions}
                onChange={(_, option) =>
                  onChangeQuantidadeParcelas(Number(option?.key))
                }
              />
            </StackItem>
            <StackItem>
              <TextField
                label="Valor da parcela"
                value={formValues.ValorParcela.toString()}
                readOnly={true}
                borderless
              />
            </StackItem>
          </Stack>
        </StackItem>

        <StackItem>
          <Stack tokens={{ childrenGap: 10 }} horizontal>
            <StackItem>
              <PrimaryButton
                onClick={async () => {
                  await onSave(formValues);
                  //onClose();
                }}
              >
                Salvar e enviar
              </PrimaryButton>
            </StackItem>
            <StackItem>
              <PrimaryButton onClick={onClose}>Fechar</PrimaryButton>
            </StackItem>
          </Stack>
        </StackItem>
      </Stack>
    </div>
  );
}
