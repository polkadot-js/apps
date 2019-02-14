// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Popup } from 'semantic-ui-react';

import { ApiPromise } from '@polkadot/api';
import { KeyringInstance } from '@polkadot/keyring/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { Log, LogType, Snippet } from './types';

import React from 'react';
import { withApi, withMulti } from '@polkadot/ui-api/index';
import { Button, Dropdown, Input } from '@polkadot/ui-app/index';
import uiKeyring from '@polkadot/ui-keyring';
import * as util from '@polkadot/util';
import * as hashing from '@polkadot/util-crypto';

import './index.css';
import snippets from './snippets';
import translate from './translate';

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
  keyring: KeyringInstance | null,
  util: typeof util,
  window: null
};
type Props = ApiProps & AppProps & I18nProps;
type State = {
  code: string,
  customExamples: Array<Snippet>
  isRunning: boolean,
  logs: Array<Log>,
  options: Array<Snippet>,
  snippet: string,
  snippetName: string
};

const customExample: Snippet = {
  code: ``,
  label: { color: 'orange', children: 'Custom', size: 'tiny' },
  text: '',
  value: ''
};

class App extends React.PureComponent<Props, State> {
  injected: Injected | null = null;
  state: State = {
    code: '',
    customExamples: [],
    isRunning: false,
    logs: [],
    options: [],
    snippet: '',
    snippetName: ''
  };

  componentDidMount () {
    const localData = {
      examples: localStorage.getItem('polkadot-app-js-examples'),
      selected: localStorage.getItem('polkadot-app-js-selected')
    };
    const customExamples = localData.examples ? JSON.parse(localData.examples) : [];
    const options: Array<Snippet> = [...customExamples, ...snippets];
    const selected = options.find(obj => obj.value === localData.selected);

    this.setState({
      customExamples,
      options,
      code: selected ? selected.code : snippets[0].code,
      snippet: selected ? selected.value : snippets[0].value
    });
  }

  render () {
    const { isDevelopment, t } = this.props;
    const { code, isRunning, logs, options, snippet, snippetName } = this.state;

    return (
      <main className='js--App'>
        <header className='container'>
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
            isDevelopment={isDevelopment}
            snippet={snippet}
            onEdit={this.onEdit}
          >
            <div className='action-button'>
              <Popup
                className='popup-local'
                onClose={this.onPopupClose}
                trigger={
                  <Button
                    isCircular
                    isPrimary
                    icon='save'
                  />
                }
                on='click'
              >
                <Input
                  autoFocus={true}
                  onChange={this.onChangeName}
                  withLabel={false}
                  maxLength={50}
                  min={1}
                  placeholder={t('Name your example')}
                />
                <Button
                  onClick={this.saveSnippet}
                  label={t('Save Snippet to local storage')}
                  isDisabled={!snippetName.length}
                  isPositive
                />
              </Popup>
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

  // move to separate component
  private onChangeName = (snippetName: string): void => {
    this.setState({ snippetName } as State);
  }

  private onPopupClose = (): void => {
    this.setState({ snippetName: '' } as State);
  }

  private runJs = async (): Promise<void> => {
    const { api, isDevelopment } = this.props;
    const { code } = this.state;

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
      keyring: isDevelopment
        ? uiKeyring.keyring
        : null,
      util,
      window: null
    };

    await this.injected.api.isReady;

    // squash into a single line so exceptions (with linenumbers) maps to the same line/origin
    // as we have in the editor view (TODO: Make the console.error here actually return the full stack)
    const exec = `(async ({${Object.keys(this.injected).join(',')}}) => { try { ${code} \n } catch (error) { console.error(error); } })(injected);`;

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
    if (value.length) {
      const { options } = this.state;
      const option = options.find(obj => obj.value === value);

      localStorage.setItem('polkadot-app-js-selected', value);
      this.setState({ code: (option ? option.code : ''), snippet: value });
    }
  }

  private saveSnippet = (): void => {
    const { code, customExamples, snippetName } = this.state;

    const snapshot: Snippet = {
      ...customExample,
      code,
      text: snippetName,
      value: `custom-${Date.now()}`
    };

    localStorage.setItem('polkadot-app-js-examples', JSON.stringify([snapshot, ...customExamples]));

    this.setState((prevState: State): State => ({
      ...prevState,
      customExamples: [snapshot, ...prevState.customExamples],
      options: [snapshot, ...prevState.options],
      snippet: snapshot.value,
      snippetName: ''
    }));
  }

  // private removeSnippet = () => {
  //   console.log('removeSnippet');
  // }

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
