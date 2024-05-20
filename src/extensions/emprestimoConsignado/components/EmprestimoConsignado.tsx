import * as React from "react";
import {
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
  isAuthor: boolean;
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
    isAuthor,
    hasApplicationInProgress,
  } = props;
  const [formValues, setFormValues] =
    React.useState<EmprestimoConsignado>(initialValue);
  const [showHRDialog, setShowHRDialog] = React.useState(false);
  const [observacaoRH, setObservacaoRH] = React.useState<string | undefined>(
    initialValue.JustificativaRH
  );

  function onChangeQuantidadeParcelas(value: string | undefined): void {
    // Se o valor for indefinido ou não for um número válido, definir como 0
    const newValue =
      value !== undefined && !isNaN(Number(value)) ? Number(value) : 0;

    // Atualizar o estado com o novo valor
    setFormValues((prev) => ({
      ...prev,
      QuantidadeParcelas: newValue,
    }));
  }

  if (hasApplicationInProgress && formValues.Status === "Rascunho") {
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
        <Stack horizontal tokens={{ childrenGap: 20 }}>
          <StackItem>
            <Stack tokens={{ childrenGap: 10 }}>
              <TextField
                label="Nome do colaborador"
                value={formValues.Colaborador.NomeColaborador}
                readOnly={true}
                borderless
              />
              <TextField
                label="Departamento do colaborador"
                value={formValues.Colaborador.Departamento.Title}
                readOnly={true}
                borderless
              />
              <TextField
                label="Filial"
                value={formValues.Colaborador.Filial.Title}
                readOnly={true}
                borderless
              />
            </Stack>
          </StackItem>
          <StackItem>
            <Stack tokens={{ childrenGap: 10 }}>
              <TextField
                label="Data da solicitação"
                value={new Date().toLocaleDateString("pt-BR")}
                readOnly={true}
                borderless
              />
              <TextField
                label="Status"
                value={formValues.Status.toString()}
                readOnly={true}
                borderless
              />
            </Stack>
          </StackItem>
        </Stack>
        <StackItem>
          <Stack>
            <TextField
              label="Valor total do empréstimo"
              value={formValues.ValorTotalEmprestimo}
              onChange={(
                e: React.FormEvent<HTMLInputElement>,
                value: string | undefined
              ) => {
                // Remove qualquer caracter que não seja número, vírgula ou ponto
                const newValue = value?.replace(/[^0-9.,]/g, "");
                setFormValues((prev) => ({
                  ...prev,
                  ValorTotalEmprestimo: newValue || "0", // Evita erro caso o usuário limpe o campo
                }));
              }}
              readOnly={formValues.Status !== "Rascunho"}
              borderless={formValues.Status !== "Rascunho"}
            />
            <TextField
              label="Quantidade de parcelas"
              value={formValues.QuantidadeParcelas.toString()}
              onChange={(
                e: React.FormEvent<HTMLInputElement>,
                value: string | undefined
              ) => onChangeQuantidadeParcelas(value)}
              readOnly={false} // Removido readOnly para permitir edição
              borderless={formValues.Status !== "Rascunho"}
            />
            <TextField
              label="Valor da parcela (R$)"
              value={formValues.ValorParcela}
              onChange={(
                e: React.FormEvent<HTMLInputElement>,
                value: string | undefined
              ) =>
                setFormValues((prev) => ({
                  ...prev,
                  ValorParcela: value || "0", // Evita erro caso o usuário limpe o campo
                }))
              }
              readOnly={formValues.Status !== "Rascunho"}
              borderless={formValues.Status !== "Rascunho"}
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

            {formValues.Status === "Em análise" &&
            isMemberHR &&
            !isAuthor &&
            isMemberHR ? (
              <HRButtons
                onApprove={handleApprove}
                onReject={() => {
                  setShowHRDialog(true);
                }}
              />
            ) : null}
          </Stack>
        </StackItem>
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
