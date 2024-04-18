import * as React from 'react';
import { Log, FormDisplayMode } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

export interface IEmprestimoConsignadoProps {
  context: FormCustomizerContext;
  displayMode: FormDisplayMode;
  onSave: () => void;
  onClose: () => void;
}

const LOG_SOURCE: string = 'EmprestimoConsignado';



const buttonStyle: React.CSSProperties = {
  backgroundColor: 'blue',
  color: 'white',
  border: 'none', 
  padding: '5px 10px', 
  margin: '5px',
  borderRadius: '3px', 
  cursor: 'pointer',
  width: '150px', 
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end', 
};

const columnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '10px',
};

export default class EmprestimoConsignado extends React.Component<IEmprestimoConsignadoProps, {}> {
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: EmprestimoConsignado mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: EmprestimoConsignado unmounted');
  }

  private redirectToNewRequest = () => {
    window.location.href = '';
  }

  private redirectToCheckRequest = () => {
    window.location.href = '';
  }

  private redirectToCancelRequest = () => {
    window.location.href = '';
  }

  public render(): React.ReactElement<{}> {
    return (
      <div style={containerStyle}>
        <div style={columnStyle}>
          <label>Nome Colaborador</label>
          <input type="text" />
        </div>
        <div style={columnStyle}>
          <label>Depto</label>
          <input type="text" />
        </div>
        <div style={columnStyle}>
          <label>Filial</label>
          <input type="text" />
        </div>
        <div style={columnStyle}>
          <label>Valor total Empréstimo</label>
          <input type="text" />
        </div>
        <div style={columnStyle}>
          <label>Valor Parcela</label>
          <input type="text" />
        </div>
        <div style={columnStyle}>
          <label>Quantidade de Parcelas</label>
          <input type="number" />
        </div>
        <button style={{ ...buttonStyle, borderRadius: '3px 3px 3px 3px', marginLeft: 'auto' }} onClick={this.redirectToNewRequest}>Nova Solicitação</button>

        <button style={{ ...buttonStyle, borderRadius: '3px 3px 3px 3px' }} onClick={this.redirectToCheckRequest}>Consultar Solicitação</button>
        <button style={{ ...buttonStyle, borderRadius: '3px 3px 3px 3px' }} onClick={this.redirectToCancelRequest}>Cancelar Solicitação</button>
      </div>
    );
  }
}
