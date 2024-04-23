import * as React from "react";
import {
  ComboBox,
  DefaultButton,
  Dialog,
  DialogType,
  PrimaryButton,
  Stack,
  StackItem,
  TextField,
} from "@fluentui/react";
import { EmprestimoConsignado } from "../../../types/EmprestimoConsignado/EmprestimoConsignado";
import { HRButtons } from "./form-buttons/hr-buttons";
import { EmprestimoConsignadoResponse } from "../../../types/EmprestimoConsignado/EmprestimoConsignadoResponse";

export interface EmprestimoConsignadoProps {
  isEmployee: boolean;
  isMemberHR: boolean;
  initialValue: EmprestimoConsignado;
  onSave: (data: EmprestimoConsignado) => Promise<EmprestimoConsignadoResponse>;
  hasApplicationInProgress: boolean;
}

export default function EmprestimoConsignado(
  props: EmprestimoConsignadoProps
): JSX.Element {
  const {
    initialValue,
    onSave,
    isEmployee,
    isMemberHR,
    hasApplicationInProgress,
  } = props;
  const [formValues, setFormValues] =
    React.useState<EmprestimoConsignado>(initialValue);
  const [showHRDialog, setShowHRDialog] = React.useState(false);
  const [observacaoRH, setObservacaoRH] = React.useState<string | undefined>(
    initialValue.JustificativaRH
  );
  // const [isSent, setIsSent] = React.useState(false);

  function onChangeValorEmprestimo(value: string | undefined): void {
    if (!value || Number.isNaN(Number(value))) {
      return;
    }

    setFormValues((prev) => ({
      ...prev,
      ValorTotalEmprestimo: value,
      ValorParcela: (Number(value) / prev.QuantidadeParcelas).toFixed(2),
    }));
  }

  function onChangeQuantidadeParcelas(
    value: string | number | undefined
  ): void {
    if (!value || Number.isNaN(Number(value))) {
      return;
    }

    setFormValues((prev) => ({
      ...prev,
      QuantidadeParcelas: Number(value),
      ValorParcela: (Number(prev.ValorTotalEmprestimo) / Number(value)).toFixed(
        2
      ),
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
    { key: "12", text: "12" },
  ];

  if (hasApplicationInProgress) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            color: "red",
          }}
        >
          Você já possui uma solicitação em andamento
        </h3>
      </div>
    );
  }

  async function _onSave(data: EmprestimoConsignado): Promise<void> {
    await onSave(data);
  }

  async function handleSend(): Promise<void> {
    await _onSave(formValues);
  }

  async function handleApprove(): Promise<void> {
    await _onSave({
      ...formValues,
      Status: "Aprovado",
    });
  }

  async function handleReject(): Promise<void> {
    await _onSave({
      ...formValues,
      JustificativaRH: observacaoRH || "",
      Status: "Rejeitado",
    });
  }

  async function handleCancel(): Promise<void> {
    await _onSave({
      ...formValues,
      Status: "Cancelado",
    });
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
                label="Data da solicitação"
                value={new Date().toLocaleDateString("pt-BR")}
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
              value={formValues.ValorTotalEmprestimo}
              onChange={(
                e: React.FormEvent<HTMLInputElement>,
                value: string | undefined
              ) => onChangeValorEmprestimo(value)}
              readOnly={formValues.Status !== "Rascunho"}
              borderless={formValues.Status !== "Rascunho"}
            />
            {formValues.Status === "Rascunho" ? (
              <ComboBox
                label="Quantidade de parcelas"
                selectedKey={formValues.QuantidadeParcelas.toString()}
                options={QuantidadeParcelasOptions}
                onChange={(_, option) =>
                  onChangeQuantidadeParcelas(option?.key)
                }
              />
            ) : (
              <>
                <TextField
                  label="Quantidade de parcelas"
                  value={formValues.QuantidadeParcelas.toString()}
                  readOnly={true}
                  borderless
                />
              </>
            )}
            <TextField
              label="Valor da parcela (R$)"
              value={formValues.ValorParcela}
              readOnly={true}
              borderless
            />
            {formValues.JustificativaRH && (
              <TextField
                label="Justificativa RH"
                value={formValues.JustificativaRH}
                readOnly={true}
                borderless
              />
            )}
          </Stack>
        </StackItem>
        <StackItem>
          <Stack tokens={{ childrenGap: 10 }}>
            {formValues.Status === "Rascunho" ? (
              <StackItem>
                <PrimaryButton onClick={handleSend}>
                  Enviar para análise
                </PrimaryButton>
              </StackItem>
            ) : null}

            {formValues.Status === "Em análise" && isEmployee ? (
              <StackItem>
                <PrimaryButton onClick={handleCancel}>
                  Cancelar Solicitação
                </PrimaryButton>
              </StackItem>
            ) : null}

            {formValues.Status === "Em análise" && isMemberHR ? (
              <HRButtons
                onApprove={handleApprove}
                onReject={() => {
                  setShowHRDialog(true);
                }}
              />
            ) : null}
          </Stack>
        </StackItem>
        {/* {isSent && (
          <StackItem>
            <MessageBar
              messageBarType={MessageBarType.success}
              isMultiline={false}
            >
              Solicitação salva com sucesso!
            </MessageBar>
          </StackItem>
        )} */}
        <Dialog
          hidden={!showHRDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: "Rejeitar solicitação?",
            closeButtonAriaLabel: "Cancelar",
            subText:
              "Você deseja rejeitar essa solicitação? (Por favor, adicione uma justificativa)",
          }}
        >
          <Stack
            tokens={{
              childrenGap: 10,
            }}
          >
            <StackItem>
              <TextField
                multiline={true}
                value={observacaoRH}
                onChange={(
                  e: React.FormEvent<HTMLInputElement>,
                  value: string | undefined
                ) => setObservacaoRH(value)}
              />
            </StackItem>
            <StackItem>
              <Stack
                tokens={{
                  childrenGap: 10,
                }}
                horizontal
              >
                <StackItem>
                  <PrimaryButton onClick={handleReject}>Rejeitar</PrimaryButton>
                </StackItem>
                <StackItem>
                  <DefaultButton onClick={() => setShowHRDialog(false)}>
                    Cancelar
                  </DefaultButton>
                </StackItem>
              </Stack>
            </StackItem>
          </Stack>
        </Dialog>
      </Stack>
    </div>
  );
}
