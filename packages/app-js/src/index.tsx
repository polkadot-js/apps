// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { CustomWindow,Log, LogType } from './types';

import React from 'react';
import { withApi, withMulti } from '@polkadot/ui-api/index';
import { Button, Dropdown } from '@polkadot/ui-app/index';
import uiKeyring from '@polkadot/ui-keyring';
import * as util from '@polkadot/util';
import * as hashing from '@polkadot/util-crypto';

import './index.css';
import snippets from './snippets';
const test = snippets.map( snippet => snippet );

console.log('SNIPPETS', snippets, test);

import Editor from './Editor';
import Output from './Output';
import translate from './translate';

type Props = ApiProps & AppProps & I18nProps;
type State = {
  code: string,
  logs: Array<Log>
};

const customWindow: CustomWindow = window;

class App extends React.PureComponent<Props, State> {
  state: State = {
    code: snippets[0].code,
    logs: []
  };

  render () {
    customWindow.api = this.props.api;

    const { logs, code } = this.state;
    const { t } = this.props;

    return (
      <main className='js--App'>
        <header className='container'>
          <p>{t('All code is wrapped within an async closure, allowing access to @polkadot/api, @polkadot/util-crypto, @polkadot/keyring and @polkadot/util.')}</p>
          <p>{t(`The api itself is exposed to the window object and you can access all it's methods by typing 'api' in you browser's console.`)}</p>
          <Dropdown
            className='js--Dropdown'
            onChange={(value) => this.selectExample(value)}
            options={snippets}
            label={'Select example'}
            placeholder='Select example'
            withLabel
          />
      </header>
        <section className='js--Content'>
          <Editor className='js--Editor' snippet={code} onEdit={this.onEdit}>
            <Button
              className='action-button'
              isCircular
              isPrimary
              icon='play'
              onClick={this.runJs}
            />
          </Editor>
          <Output className='js--Output' logs={logs}>
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

  private selectExample = (value: string) => {
    this.onEdit(value);
    console.log('VALUE', value);
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

    const exec = `(async ({${Object.keys(injected).join(',')}}) => {
      try {
        ${code}
      } catch (error) {
        console.error(error);
      }
    })(injected);`;

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
