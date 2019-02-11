// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { Log, LogType } from './types';

import React from 'react';
import { withApi, withMulti } from '@polkadot/ui-api/index';
import { Button } from '@polkadot/ui-app/index';
import uiKeyring from '@polkadot/ui-keyring';
import * as util from '@polkadot/util';
import * as hashing from '@polkadot/util-crypto';

import './index.css';

import Editor from './Editor';
import Output from './Output';
import translate from './translate';

type Props = ApiProps & AppProps & I18nProps;
type State = {
  code: string,
  logs: Array<Log>
};

class App extends React.PureComponent<Props, State> {
  state: State = {
    code: '',
    logs: []
  };

  render () {
    const { logs } = this.state;

    return (
      <main className='js--App'>
        <Editor onEdit={this.onEdit}>
          <Button
            className='action-button'
            isCircular
            isPrimary
            icon='play'
            onClick={this.runJs}
          />
        </Editor>
        <Output logs={logs}>
          <Button
            className='action-button'
            isCircular
            isNegative
            icon='erase'
            onClick={this.clearConsole}
          />
        </Output>
      </main>
    );
  }

  private runJs = (): void => {
    const { api } = this.props;
    const { code } = this.state;
    const { keyring } = uiKeyring;
    const injected = {
      api,
      console: {
        error: this.hookConsole('error'),
        log: this.hookConsole('log')
      },
      global: null,
      hashing,
      keyring,
      util,
      window: null
    };

    const exec = `(async ({${Object.keys(injected).join(',')}}) => { try { ${code} } catch (error) { console.error(error); } })(injected);`;

    new Function('injected', exec)(injected);
  }

  private onEdit = (code: string): void => {
    this.setState({ code });
  }

  private clearConsole = () => {
    this.setState({ logs: [] });
  }

  private hookConsole = (type: LogType) => {
    return (...args: Array<any>): void => {
      this.setState(({ logs }: State) => {
        logs.push({ args, type });

        return { logs: logs.slice(0) };
      });
    };
  }
}

export default withMulti(
  App,
  translate,
  withApi
);
