import * as React from "react";
import * as ReactDOM from "react-dom";

import { BaseFormCustomizer } from "@microsoft/sp-listview-extensibility";

import EmprestimoConsignado, {
  EmprestimoConsignadoProps,
} from "./components/EmprestimoConsignado";
import { Colaborador } from "../../types/Colaborador/Colaborador";
import { SPHttpClient } from "@microsoft/sp-http";
import { ColaboradorResponse } from "../../types/Colaborador/ColaboradorResponse";
import { UserProfile } from "../../types/UserProfile";
import { EmprestimoConsignadoResponse } from "../../types/EmprestimoConsignado/EmprestimoConsignadoResponse";
import { FormDisplayMode } from "@microsoft/sp-core-library";
import { EmprestimoConsignadoCreate } from "../../types/EmprestimoConsignado/EmprestimoConsignadoCreate";
import { EmprestimoConsignadoUpdate } from "../../types/EmprestimoConsignado/EmprestimoConsignadoUpdate";
import { isMemberOfGroup } from "../../utils/isMemberOfGroup";

/**
 * If your form customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IEmprestimoConsignadoFormCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

export default class EmprestimoConsignadoFormCustomizer extends BaseFormCustomizer<IEmprestimoConsignadoFormCustomizerProperties> {
  private colaboradoresListId: string = "2511179d-6e7d-4027-b73f-7136363f96f2";
  private departamentosListId: string = "cd8b62cc-eaad-458a-a647-e2ef592d9b26";
  private filialListId: string = "bd591e12-52eb-444f-bc66-928c82a53065";
  private emprestimosConsignadosListId: string =
    "302dfc4c-c220-467f-8ab5-cd9349ea89c9";

  private isEmployee: boolean = false;
  private isMemberHR: boolean = false;
  private colaborador: Colaborador = {
    Id: 0,
    NomeColaborador: "",
    Email: "",
    Telefone: "",

    Departamento: {
      Id: 0,
      Title: "",
      Ativo: false,
    },

    Filial: {
      Id: 0,
      Title: "",
    },
  };

  private initialValue: EmprestimoConsignadoProps["initialValue"] = {
    Colaborador: this.colaborador,
    ValorTotalEmprestimo: "0",
    ValorParcela: "0",
    QuantidadeParcelas: 1,
    Status: "Rascunho",
  };

  private hasApplicationInProgress: boolean = false;

  private getColaborador = async (): Promise<Colaborador> => {
    const response = await this.context.spHttpClient.get(
      `${this.context.pageContext.web.absoluteUrl}/_api/web/currentuser`,
      SPHttpClient.configurations.v1
    );

    const userProfile: UserProfile = await response.json();

    const colaboradorResponse = await this.context.spHttpClient.get(
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${this.colaboradoresListId}')/items?$filter=Email eq '${userProfile.Email}'`,
      SPHttpClient.configurations.v1
    );

    const colaborador: ColaboradorResponse = (await colaboradorResponse.json())
      .value[0];

    const departamentoResponse = await this.context.spHttpClient.get(
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${this.departamentosListId}')/items(${colaborador.DepartamentoId})`,
      SPHttpClient.configurations.v1
    );

    const departamento = await departamentoResponse.json();

    const filialResponse = await this.context.spHttpClient.get(
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${this.filialListId}')/items(${colaborador.FilialId})`,
      SPHttpClient.configurations.v1
    );

    const filial = await filialResponse.json();

    return {
      Id: colaborador.Id,
      NomeColaborador: colaborador.Title,
      Email: colaborador.Email,
      Telefone: colaborador.Telefone,

      Departamento: {
        Id: departamento.Id,
        Title: departamento.Title,
        Ativo: departamento.Ativo,
      },

      Filial: {
        Id: filial.Id,
        Title: filial.Title,
      },
    };
  };

  public async onInit(): Promise<void> {
    // Add your custom initialization to this method. The framework will wait
    // for the returned promise to resolve before rendering the form.

    this.colaborador = await this.getColaborador();
    this.initialValue.Colaborador = this.colaborador;

    this.isEmployee =
      this.context.pageContext.user.email === this.colaborador.Email;
    this.isMemberHR = await isMemberOfGroup(139, this.context);

    const hasApplicationInProgress = await this.context.spHttpClient.get(
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${this.emprestimosConsignadosListId}')/items/?$filter=ColaboradorId eq ${this.colaborador.Id} and Status eq 'Em análise'`,
      SPHttpClient.configurations.v1
    );

    this.hasApplicationInProgress =
      (await hasApplicationInProgress.json()).value.length > 0;

    if (this.hasApplicationInProgress) {
      Promise.resolve();
    }

    if (
      FormDisplayMode.Edit === this.displayMode ||
      FormDisplayMode.Display === this.displayMode
    ) {
      const id = this.context.pageContext.listItem?.id;

      if (!id) {
        throw new Error("Id is not defined");
      }

      const emprestimoConsignadoResponse = await this.context.spHttpClient.get(
        `${this.context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${this.emprestimosConsignadosListId}')/items(${id})`,
        SPHttpClient.configurations.v1
      );

      const emprestimoConsignado: EmprestimoConsignadoResponse =
        await emprestimoConsignadoResponse.json();
      this.initialValue = {
        Colaborador: this.colaborador,
        ValorTotalEmprestimo: emprestimoConsignado.ValorTotalEmprestimo,
        ValorParcela: emprestimoConsignado.ValorParcela,
        QuantidadeParcelas: emprestimoConsignado.QuantidadeParcelas,
        Status: emprestimoConsignado.Status,
        JustificativaRH: emprestimoConsignado.JustificativaRH,
      };

      return Promise.resolve();
    }
  }

  public render(): void {
    // Use this method to perform your custom rendering.

    const emprestimoConsignado: React.ReactElement<{}> = React.createElement(
      EmprestimoConsignado,
      {
        onSave: this._onSave,
        onClose: this._onClose,
        initialValue: this.initialValue,
        isEmployee: this.isEmployee,
        isMemberHR: this.isMemberHR,
        hasApplicationInProgress: this.hasApplicationInProgress,
      } as EmprestimoConsignadoProps
    );

    ReactDOM.render(emprestimoConsignado, this.domElement);
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  private _onSave = async (
    data: EmprestimoConsignadoProps["initialValue"]
  ): Promise<EmprestimoConsignadoResponse> => {
    // You MUST call this.formSaved() after you save the form.

    if (
      FormDisplayMode.Edit === this.displayMode ||
      FormDisplayMode.Display === this.displayMode
    ) {
      const id = this.context.pageContext.listItem?.id;

      if (!id) {
        throw new Error("Id is not defined");
      }

      const response = this.updateEmprestimoConsignado(id, {
        ColaboradorId: data.Colaborador.Id,
        ValorTotalEmprestimo: data.ValorTotalEmprestimo,
        ValorParcela: data.ValorParcela,
        QuantidadeParcelas: data.QuantidadeParcelas,
        Status: data.Status,
        JustificativaRH: data.JustificativaRH || "",
      }) as Promise<EmprestimoConsignadoResponse>;

      window.location.reload();

      return response;
    }

    const response = this.createEmprestimoConsignado({
      ValorTotalEmprestimo: data.ValorTotalEmprestimo,
      ValorParcela: data.ValorParcela,
      QuantidadeParcelas: data.QuantidadeParcelas,
      ColaboradorId: data.Colaborador.Id,
      Status: "Em análise",
      JustificativaRH: "",
    }) as Promise<EmprestimoConsignadoResponse>;

    window.location.reload();

    return response;
  };

  private _onClose = (): void => {
    // You MUST call this.formClosed() after you close the form.
    this.formClosed();
  };

  private createEmprestimoConsignado = async (
    data: EmprestimoConsignadoCreate
  ): Promise<EmprestimoConsignadoResponse> => {
    const response = await this.context.spHttpClient.post(
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${this.emprestimosConsignadosListId}')/items`,
      SPHttpClient.configurations.v1,
      {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return response.json();
  };

  private updateEmprestimoConsignado = async (
    id: number,
    data: EmprestimoConsignadoUpdate
  ): Promise<EmprestimoConsignadoResponse> => {
    const response = await this.context.spHttpClient.post(
      `${this.context.pageContext.web.absoluteUrl}/_api/web/lists(guid'${this.emprestimosConsignadosListId}')/items(${id})`,
      SPHttpClient.configurations.v1,
      {
        body: JSON.stringify(data),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "IF-MATCH": "*",
          "X-HTTP-Method": "MERGE",
        },
      }
    );

    return response.json();
  };
}
