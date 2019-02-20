// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { KeyringInstance } from '@polkadot/keyring/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { Log, LogType, Snippet } from './types';

import React from 'react';
import { withApi, withMulti } from '@polkadot/ui-api/index';
import { Button, Dropdown } from '@polkadot/ui-app/index';
import uiKeyring from '@polkadot/ui-keyring';
import * as util from '@polkadot/util';
import * as hashing from '@polkadot/util-crypto';

import './index.css';
import makeWrapper from './snippets/wrapping';
import snippets from './snippets';
import translate from './translate';
import { STORE_EXAMPLES, STORE_SELECTED, CUSTOM_LABEL } from './constants';

import Editor from './Editor';
import Output from './Output';
import LocalStorage from './LocalStorage';

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
  customExamples: Array<Snippet>,
  isCustomExample: boolean,
  isRunning: boolean,
  logs: Array<Log>,
  options: Array<Snippet>,
  snippet: Snippet
};

class App extends React.PureComponent<Props, State> {
  injected: Injected | null = null;
  snippets: Array<Snippet> = JSON.parse(JSON.stringify(snippets));

  constructor (props: Props) {
    super(props);
    this.snippets.forEach(snippet => snippet.code = `${makeWrapper(this.props.isDevelopment)}${snippet.code}`);

    this.state = {
      customExamples: [],
      isCustomExample: false,
      isRunning: false,
      logs: [],
      options: [],
      snippet: this.snippets[0]
    };
  }

  componentDidMount () {
    const localData = {
      examples: localStorage.getItem(STORE_EXAMPLES),
      selected: localStorage.getItem(STORE_SELECTED)
    };
    const customExamples = localData.examples ? JSON.parse(localData.examples) : [];
    const options: Array<Snippet> = [...customExamples, ...this.snippets];
    const selected = options.find(obj => obj.value === localData.selected);

    this.setState({
      customExamples,
      isCustomExample: (selected && selected.custom === 'true') || false,
      options,
      snippet: selected || this.snippets[0]
    } as State);
  }

  render () {
    const { isDevelopment, t } = this.props;
    const { isCustomExample, isRunning, logs, options, snippet } = this.state;
    const snippetName = snippet.custom === 'true' ? snippet.text : undefined;

    return (
      <main className='js--App'>
        <header className='container'>
          <Dropdown
            className='js--Dropdown'
            onChange={this.selectExample}
            options={options}
            label={t('Select example')}
            defaultValue={snippet.value}
            withLabel
          />
        </header>
        <section className='js--Content'>
          <article className='container js--Editor'>
            <Editor
              code={snippet.code}
              isDevelopment={isDevelopment}
              onEdit={this.onEdit}
            />
            <div className='action-button'>
              <LocalStorage
                isCustomExample={isCustomExample}
                removeSnippet={this.removeSnippet}
                saveSnippet={this.saveSnippet}
                snippetName={snippetName}
              />
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
          </article>
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
    const { api, isDevelopment } = this.props;
    const { code } = this.state.snippet;

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

    this.setState({ isRunning: true } as State);
  }

  private stopJs = (): void => {
    if (!this.injected) {
      return;
    }

    this.injected.api.disconnect();
    this.injected = null;

    this.setState({ isRunning: false } as State);
  }

  private selectExample = (value: string) => {
    if (value.length) {
      const { options } = this.state;
      const option = options.find(obj => obj.value === value);

      if (option) {
        localStorage.setItem(STORE_SELECTED, value);
        this.setState({
          logs: [],
          isCustomExample: option.custom === 'true',
          snippet: option
        });
      }
    }
  }

  private saveSnippet = (snippetName: string): void => {
    const { customExamples, snippet: { code } } = this.state;

    // The <Dropdown> component doesn't take boolean custom props and no
    // camelCase keys, that's why 'custom' is passed as a string here
    const snapshot: Snippet = {
      code,
      custom: 'true',
      label: CUSTOM_LABEL,
      text: snippetName,
      value: `custom-${Date.now()}`
    };

    localStorage.setItem(STORE_EXAMPLES, JSON.stringify([snapshot, ...customExamples]));

    this.setState((prevState: State): State => ({
      ...prevState,
      customExamples: [snapshot, ...prevState.customExamples],
      isCustomExample: true,
      options: [snapshot, ...prevState.options],
      snippet: snapshot
    }) as State);
  }

  private removeSnippet = (): void => {
    const { customExamples, snippet } = this.state;
    const filtered = customExamples.filter((value) => value.value !== snippet.value);
    const nextOptions = [...filtered, ...this.snippets];

    this.setState((prevState: State): State => ({
      ...prevState,
      customExamples: filtered,
      isCustomExample: nextOptions[0].custom === 'true' || false,
      options: nextOptions
    }) as State);

    this.selectExample(nextOptions[0].value);
    localStorage.setItem(STORE_EXAMPLES, JSON.stringify(filtered));
  }

  private onEdit = (code: string): void => {
    if (code !== this.state.snippet.code) {
      this.setState((prevState: State): State => ({
        snippet: { ...prevState.snippet, code },
        isCustomExample: false
      } as State));
    }
  }

  private clearConsole = (): void => {
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
