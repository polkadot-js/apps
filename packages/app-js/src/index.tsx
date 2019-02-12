// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { KeyringInstance } from '@polkadot/keyring/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { Log, LogType } from './types';

import React from 'react';
import { withApi, withMulti } from '@polkadot/ui-api/index';
import { Button, Dropdown } from '@polkadot/ui-app/index';
import uiKeyring from '@polkadot/ui-keyring';
import * as util from '@polkadot/util';
import * as hashing from '@polkadot/util-crypto';

import './index.css';
import snippets from './snippets';
import translate from './translate';

import Intro from './Intro';
import Editor from './Editor';
import Output from './Output';

type Injected = {
  api: ApiPromise,
  console: {
    error: (...args: Array<any>) => void,
    log: (...args: Array<any>) => void
  },
  global: null,
  hashing: typeof hashing,
  keyring: KeyringInstance,
  util: typeof util,
  window: null
};
type Props = ApiProps & AppProps & I18nProps;
type State = {
  code: string,
  isRunning: boolean,
  logs: Array<Log>,
  snippet: string
};

const local = snippets.find(obj => obj.value === localStorage.getItem('app-js-snippet'));

class App extends React.PureComponent<Props, State> {
  injected: Injected | null = null;
  state: State = {
    code: local ? local.code : snippets[0].code,
    isRunning: false,
    logs: [],
    snippet: local ? local.value : snippets[0].value
  };

  render () {
    const { code, isRunning, logs, snippet } = this.state;
    const { t } = this.props;
    const options = snippets.map(({ code, ...options }) => ({ ...options }));

    return (
      <main className='js--App'>
        <header className='container'>
          <Intro />
          <Dropdown
            className='js--Dropdown'
            onChange={this.selectExample}
            options={options}
            label={t('Select example')}
            defaultValue={snippet}
            withLabel
          />
      </header>
        <section className='js--Content'>
          <Editor
            code={code}
            snippet={snippet}
            onEdit={this.onEdit}
          >
            <div className='action-button'>
              <Button
                isCircular
                isPrimary
                icon='play'
                onClick={this.runJs}
              />
              <Button
                isCircular
                isDisabled={!isRunning}
                isNegative
                icon='close'
                onClick={this.stopJs}
              />
            </div>
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
        </section>
      </main>
    );
  }

  private runJs = async (): Promise<void> => {
    const { api } = this.props;
    const { code } = this.state;
    const { keyring } = uiKeyring;

    this.stopJs();
    this.clearConsole();

    this.injected = {
      api: api.clone(),
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

    await this.injected.api.isReady;

    // squash into a single line so exceptions (with linenumbers) maps to the same line/origin
    // as we have in the editor view (TODO: Make the console.error here actually return the full stack)
    const exec = `(async ({${Object.keys(this.injected).join(',')}}) => { try { ${code} } catch (error) { console.error(error); } })(injected);`;

    new Function('injected', exec)(this.injected);

    this.setState({ isRunning: true });
  }

  private stopJs = (): void => {
    if (!this.injected) {
      return;
    }

    this.injected.api.disconnect();
    this.injected = null;

    this.setState({ isRunning: false });
  }

  private selectExample = (value: string) => {
    const snippet = snippets.find(obj => obj.value === value);

    localStorage.setItem('app-js-snippet', value);
    this.setState({ code: (snippet ? snippet.code : ''), snippet: value });
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
