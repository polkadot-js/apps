// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { KeyringInstance } from '@polkadot/keyring/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { Log, LogType, Snippet } from './types';

import React from 'react';
import { withRouter } from 'react-router';
import { Transition } from 'semantic-ui-react';
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
import ActionButtons from './ActionButtons';

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
type Props = ApiProps & AppProps & I18nProps & {
  match: {
    params: {
      base64?: string
    }
  },
  // FIXME wait for proper eslint integration in tslint, then hopefully remove this
  history: any
};
type State = {
  animated: boolean,
  customExamples: Array<Snippet>,
  isCustomExample: boolean,
  isRunning: boolean,
  logs: Array<Log>,
  options: Array<Snippet>,
  sharedExample?: Snippet,
  selected: Snippet
};

class Playground extends React.PureComponent<Props, State> {
  injected: Injected | null = null;
  snippets: Array<Snippet> = JSON.parse(JSON.stringify(snippets));

  constructor (props: Props) {
    super(props);
    this.snippets.forEach(snippet => snippet.code = `${makeWrapper(this.props.isDevelopment)}${snippet.code}`);

    this.state = {
      animated: true,
      customExamples: [],
      isCustomExample: false,
      isRunning: false,
      logs: [],
      options: [],
      selected: this.snippets[0],
      sharedExample: undefined
    };
  }

  // FIXME: Semantic UI is still using Reacts old lifecycle methods that are considered as unsafe (eg. componentWillMount).
  // There's a ticket and an ongoing process of updating SUI to the new lifecycle methods (here: componentDidMount).
  // Please check https://github.com/Semantic-Org/Semantic-UI-React/issues/2732 for details
  // This needs to change to componentDidMount() as soon as the original MUI component got updated
  componentWillMount () {
    const { match: { params: { base64 } } } = this.props;

    const sharedExample = base64 ? this.decodeBase64(base64) : undefined;
    const localData = {
      examples: localStorage.getItem(STORE_EXAMPLES),
      selectedValue: localStorage.getItem(STORE_SELECTED)
    };
    const customExamples = localData.examples ? JSON.parse(localData.examples) : [];
    const options: Array<Snippet> = sharedExample
      ? [sharedExample, ...customExamples, ...this.snippets]
      : [...customExamples, ...this.snippets];

    const selected = options.find(option => option.value === localData.selectedValue);

    this.setState((prevState: State): State => ({
      customExamples,
      isCustomExample: (selected && selected.type === 'custom') || false,
      options,
      selected: sharedExample || selected || this.snippets[0],
      sharedExample
    }) as State);
  }

  render () {
    const { isDevelopment, t } = this.props;
    const { animated, isCustomExample, isRunning, logs, options, selected } = this.state;
    const snippetName = selected.type === 'custom' ? selected.text : undefined;

    return (
      <main className='js--App'>
        <header className='container'>
          <Dropdown
            className='js--Dropdown'
            onChange={this.selectExample}
            options={options}
            label={t('Select example')}
            defaultValue={selected.value}
          />
        </header>
        <section className='js--Content'>
          <Transition animation='glow' duration={700} visible={animated}>
            <article className='container js--Editor'>
              <Editor
                code={selected.code}
                isDevelopment={isDevelopment}
                onEdit={this.onEdit}
              />
              <ActionButtons
                isCustomExample={isCustomExample}
                isRunning={isRunning}
                generateLink={this.generateLink}
                removeSnippet={this.removeSnippet}
                runJs={this.runJs}
                saveSnippet={this.saveSnippet}
                snippetName={snippetName}
                stopJs={this.stopJs}
              />
            </article>
          </Transition>
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
    const { code } = this.state.selected;

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
      const option = options.find(option => option.value === value);

      if (option) {
        localStorage.setItem(STORE_SELECTED, value);
        this.setState({
          logs: [],
          isCustomExample: option.type === 'custom',
          selected: option
        });
      }
    }
  }

  private saveSnippet = (snippetName: string): void => {
    const { customExamples, sharedExample, selected: { code, type } } = this.state;

    // The <Dropdown> component doesn't take boolean custom props and no
    // camelCase keys, that's why 'custom' is passed as a string here
    const snapshot: Snippet = {
      code,
      type: 'custom',
      label: CUSTOM_LABEL,
      text: snippetName,
      value: `custom-${Date.now()}`
    };
    const nextOptions = [snapshot, ...customExamples, ...this.snippets];
    const options = (type === 'shared')
      ? nextOptions
      : sharedExample
        ? [sharedExample, ...nextOptions]
        : nextOptions;

    localStorage.setItem(STORE_EXAMPLES, JSON.stringify([snapshot, ...customExamples]));

    this.setState((prevState: State): State => ({
      ...prevState,
      customExamples: [snapshot, ...prevState.customExamples],
      isCustomExample: true,
      options,
      sharedExample: type === 'shared' ? undefined : prevState.sharedExample,
      selected: snapshot
    }) as State);
  }

  private removeSnippet = (): void => {
    const { customExamples, selected } = this.state;
    const filtered = customExamples.filter((value) => value.value !== selected.value);
    const nextOptions = [...filtered, ...this.snippets];

    this.setState((prevState: State): State => ({
      ...prevState,
      customExamples: filtered,
      isCustomExample: nextOptions[0].type === 'custom' || false,
      options: prevState.sharedExample ? [prevState.sharedExample, ...nextOptions] : nextOptions
    }) as State);

    this.selectExample(nextOptions[0].value);
    localStorage.setItem(STORE_EXAMPLES, JSON.stringify(filtered));
  }

  private onEdit = (code: string): void => {
    if (code !== this.state.selected.code) {
      this.setState((prevState: State): State => ({
        selected: { ...prevState.selected, code },
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

  private decodeBase64 = (base64: string) => {
    try {
      const decoded = atob(base64);

      return ({
        code: decoded,
        label: { basic: true, children: 'URL', size: 'tiny' },
        text: 'Shared code example (unsaved)',
        type: 'shared',
        value: `custom-${Date.now()}`
      });
    } catch (e) {
      return undefined;
    }
  }

  private generateLink = (): void => {
    const {
      props: { history, match: { params: { base64 } } },
      state: { selected: { code } }
    } = this;
    const base64code = btoa(code);
    const path = `/js/share/${base64code}`;

    if (base64code !== base64) {
      history.push(path);
    }

    const basePath = window.location.pathname.replace('/', '').length > 0
      ? `${window.location.origin}/${window.location.pathname.replace('/', '')}`
      : `${window.location.origin}`;

    this.copyToClipboard(`${basePath}/#${path}`);
  }

  private copyToClipboard = (link: string): void => {
    // See https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    const el = document.createElement('textarea');
    el.value = link;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);

    const existingSelection = document.getSelection()!;

    const selected = existingSelection && existingSelection.rangeCount > 0
        ? existingSelection.getRangeAt(0)
        : undefined;

    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    if (selected) {
      existingSelection.removeAllRanges();
      existingSelection.addRange(selected);
    }

    this.setState({ animated: !this.state.animated });
  }
}

export default withMulti(
  Playground,
  translate,
  withApi,
  withRouter
);
