import * as React from "react";
import {
  ComboBox,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Stack,
  StackItem,
  TextField,
} from "@fluentui/react";
import { EmprestimoConsignado } from "../../../types/EmprestimoConsignado/EmprestimoConsignado";

export interface EmprestimoConsignadoProps {
  initialValue: EmprestimoConsignado;
  onSave: (data: EmprestimoConsignado) => Promise<void>;
}

export default function EmprestimoConsignado(
  props: EmprestimoConsignadoProps
): JSX.Element {
  const { initialValue, onSave } = props;
  const [formValues, setFormValues] =
    React.useState<EmprestimoConsignado>({
      ...initialValue,
      QuantidadeParcelas: 1, 
    });
  const [isSent, setIsSent] = React.useState(false);

  function onChangeValorEmprestimo(value: string | undefined): void {
    if (!value) {
      return;
    }
    setFormValues((prev) => ({
      ...prev,
      ValorTotalEmprestimo: Number(value),
      ValorParcela: Number(value) / Number(prev.QuantidadeParcelas)
      
    }));
  }

  function onChangeQuantidadeParcelas(value: number): void {
    setFormValues((prev) => ({
      ...prev,
      QuantidadeParcelas: value,
      ValorParcela: prev.ValorTotalEmprestimo / value,
    }));
  }
  

  const QuantidadeParcelasOptions = [
    { key: "1", text: "1" },
    { key: "2", text: "2" },
    { key: "3", text: "3" },
    { key: "4", text: "4" },
    { key: "5", text: "5" },
    { key: "6", text: "6" },
    { key: "7", text: "7" },
    { key: "8", text: "8" },
    { key: "9", text: "9" },
    { key: "10", text: "10" },
    { key: "11", text: "11" },
    { key: "12", text: "12" } 
  ];

  async function handleApproveAndSend() {
    await onSave(formValues);
    setIsSent(true);
  }

  function handleCancel() {
    window.location.reload();
  }

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
          <Stack horizontal verticalAlign="center">
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
                style={{ marginRight: "50px" }}
              />
            </StackItem>
            <StackItem>
              <TextField
                label="Filial"
                value={formValues.Colaborador.Filial.Title}
                readOnly={true}
                borderless
              />
            </StackItem>

            <StackItem>
              <TextField
                label="Dia"
                value={new Date().toLocaleDateString('pt-BR')}
                readOnly={true}
                borderless
                style={{ marginRight: "50px" }}
              />
            </StackItem>

            <StackItem>
              <TextField
                label="Status"
                value={formValues.Status.toString()}
                readOnly={true}
                borderless
                style={{ marginRight: "50px" }}
              />
            </StackItem>

          </Stack>
        </StackItem>
        <StackItem>
          <Stack>
            <TextField
              label="Valor total do empréstimo"
              value={formValues.ValorTotalEmprestimo.toString()}
              onChange={(
                e: React.FormEvent<HTMLInputElement>,
                value: string | undefined
              ) => onChangeValorEmprestimo(value)}
            />
            <ComboBox
              label="Quantidade de parcelas"
              selectedKey={formValues.QuantidadeParcelas.toString()}
              options={QuantidadeParcelasOptions}
              onChange={(_, option) =>
                onChangeQuantidadeParcelas(Number(option?.key || 1))
              }
            />
            <TextField
              label="Valor da parcela (R$)"
              value={`R$ ${formValues.ValorParcela.toString()}`}
              readOnly={true}
              borderless
            />
          </Stack>
        </StackItem>
        <StackItem>
          <Stack tokens={{ childrenGap: 10 }}>
            <PrimaryButton onClick={handleApproveAndSend}>
              Send to Approve
            </PrimaryButton>
            <PrimaryButton onClick={handleCancel}>Cancel</PrimaryButton>
          </Stack>
        </StackItem>
        {isSent && (
          <StackItem>
            <MessageBar
              messageBarType={MessageBarType.success}
              isMultiline={false}
            >
              Solicitação de empréstimo enviada com sucesso!
            </MessageBar>
          </StackItem>
        )}
      </Stack>
    </div>
  );
}