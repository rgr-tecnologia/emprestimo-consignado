import * as React from 'react';
import { Log, FormDisplayMode } from '@microsoft/sp-core-library';
import { FormCustomizerContext } from '@microsoft/sp-listview-extensibility';

import styles from './EmprestimoConsignado.module.scss';

export interface IEmprestimoConsignadoProps {
  context: FormCustomizerContext;
  displayMode: FormDisplayMode;
  onSave: () => void;
  onClose: () => void;
}

const LOG_SOURCE: string = 'EmprestimoConsignado';

export default class EmprestimoConsignado extends React.Component<IEmprestimoConsignadoProps, {}> {
  public componentDidMount(): void {
    Log.info(LOG_SOURCE, 'React Element: EmprestimoConsignado mounted');
  }

  public componentWillUnmount(): void {
    Log.info(LOG_SOURCE, 'React Element: EmprestimoConsignado unmounted');
  }

  public render(): React.ReactElement<{}> {
    return <div className={styles.emprestimoConsignado} />;
  }
}
