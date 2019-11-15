// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { KeyringInstance } from '@polkadot/keyring/types';
import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { Log, LogType, Snippet } from './types';

import React, { useRef, useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Transition } from 'semantic-ui-react';
import snappy from 'snappyjs';
import styled from 'styled-components';
import { Button, Dropdown, Editor } from '@polkadot/react-components';
import { useApiContext } from '@polkadot/react-hooks';
import uiKeyring from '@polkadot/ui-keyring';
import * as types from '@polkadot/types';
import * as util from '@polkadot/util';
import * as hashing from '@polkadot/util-crypto';

import makeWrapper from './snippets/wrapping';
import allSnippets from './snippets';
import translate from './translate';
import { STORE_EXAMPLES, STORE_SELECTED, CUSTOM_LABEL } from './constants';

import Output from './Output';
import ActionButtons from './ActionButtons';

interface Injected {
  api: ApiPromise;
  console: {
    error: (...args: any[]) => void;
    log: (...args: any[]) => void;
  };
  global: null;
  hashing: typeof hashing;
  keyring: KeyringInstance | null;
  types: typeof types;
  util: typeof util;
  window: null;
}

interface Props extends AppProps, I18nProps, RouteComponentProps<{}> {
  match: {
    isExact: boolean;
    params: {
      base64?: string;
    };
    path: string;
    url: string;
  };
  // FIXME wait for proper eslint integration in tslint, then hopefully remove this
  history: any;
}

const snippets: Snippet[] = JSON.parse(JSON.stringify(allSnippets));
let hasSnippetWrappers = false;

function decodeBase64 (base64: string): Snippet {
  const sharedExample: Snippet = {
    code: '',
    label: { basic: true, children: 'URL', size: 'tiny' },
    text: 'Shared code example (unsaved)',
    type: 'shared',
    value: `custom-${Date.now()}`
  };

  try {
    const compStr = atob(base64);
    const compU8a = new Uint8Array(compStr.length);

    compU8a.forEach((_, i): void => {
      compU8a[i] = compStr.charCodeAt(i);
    });

    const u8a = snappy.uncompress(compU8a);
    const code = util.u8aToString(u8a);

    sharedExample.code = code;
  } catch (error) {
    const errorMessage = 'ERROR: Unable to decode code example from URL';

    console.error(`${errorMessage}: \n${error}`);
    sharedExample.code = `// ${errorMessage}`;
  }

  return sharedExample;
}

// FIXME This... ladies & gentlemen, is a mess that should be untangled
function Playground ({ className, history, match: { params: { base64 } }, t }: Props): React.ReactElement<Props> {
  const { api, isDevelopment } = useApiContext();
  const injectedRef = useRef<Injected | null>(null);
  const [code, setCode] = useState('');
  const [isAnimated, setIsAnimated] = useState(true);
  const [isCustomExample, setIsCustomExample] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [customExamples, setCustomExamples] = useState<Snippet[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [options, setOptions] = useState<Snippet[]>([]);
  const [selected, setSelected] = useState(snippets[0]);
  const [sharedExample, setSharedExample] = useState<Snippet | undefined>();

  // add snippet wrappers
  useEffect((): void => {
    if (!hasSnippetWrappers) {
      snippets.forEach((snippet): void => {
        snippet.code = `${makeWrapper(isDevelopment)}${snippet.code}`;
      });

      hasSnippetWrappers = true;
    }
  }, []);

  // initialize all options
  useEffect((): void => {
    const sharedExample = base64 ? decodeBase64(base64) : undefined;
    const localData = {
      examples: localStorage.getItem(STORE_EXAMPLES),
      selectedValue: localStorage.getItem(STORE_SELECTED)
    };
    const customExamples = localData.examples ? JSON.parse(localData.examples) : [];

    const options: Snippet[] = sharedExample
      ? [sharedExample, ...customExamples, ...snippets]
      : [...customExamples, ...snippets];

    const selected = options.find((option): boolean => option.value === localData.selectedValue);

    setCustomExamples(customExamples);
    setIsCustomExample((selected && selected.type === 'custom') || false);
    setOptions(options);
    setSelected(sharedExample || selected || snippets[0]);
    setSharedExample(sharedExample);
  }, []);

  useEffect((): void => {
    setCode(selected.code);
  }, [selected]);

  const _clearConsole = (): void => setLogs([]);
  const _hookConsole = (type: LogType, args: any[]): void => {
    logs.push({ args, type });
    setLogs(logs.slice(0));
  };
  const _copyToClipboard = (link: string): void => {
    // See https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
    const el = document.createElement('textarea');

    el.value = link;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);

    const existingSelection = document.getSelection();
    const selected = existingSelection && existingSelection.rangeCount > 0
      ? existingSelection.getRangeAt(0)
      : undefined;

    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    if (existingSelection && selected) {
      existingSelection.removeAllRanges();
      existingSelection.addRange(selected);
    }

    setIsAnimated(!isAnimated);
  };
  const _stopJs = (): void => {
    if (injectedRef.current) {
      injectedRef.current.api.disconnect();
      injectedRef.current = null;
    }

    setIsRunning(false);
  };
  const _runJs = async (): Promise<void> => {
    setIsRunning(true);
    _clearConsole();

    injectedRef.current = {
      api: api.clone(),
      console: {
        error: (...args: any[]): void => _hookConsole('error', args),
        log: (...args: any[]): void => _hookConsole('log', args)
      },
      global: null,
      hashing,
      keyring: isDevelopment
        ? uiKeyring.keyring
        : null,
      types,
      util,
      window: null
    };

    await injectedRef.current.api.isReady;

    // squash into a single line so exceptions (with line numbers) maps to the same line/origin
    // as we have in the editor view (TODO: Make the console.error here actually return the full stack)
    const exec = `(async ({${Object.keys(injectedRef.current).join(',')}}) => { try { ${code} \n } catch (error) { console.error(error); } })(injected);`;

    // eslint-disable-next-line no-new-func
    new Function('injected', exec)(injectedRef.current);

    setIsRunning(false);
  };
  const _selectExample = (value: string): void => {
    _stopJs();

    if (value.length) {
      const option = options.find((option): boolean => option.value === value);

      if (option) {
        localStorage.setItem(STORE_SELECTED, value);

        _clearConsole();
        setIsCustomExample(option.type === 'custom');
        setSelected(option);
      }
    }
  };
  const _generateLink = (): void => {
    const u8a = util.stringToU8a(code);
    const compU8a = snappy.compress(u8a);
    const compStr = compU8a.reduce((str: string, ch: number): string => {
      return str + String.fromCharCode(ch);
    }, '');

    const base64code = btoa(compStr);
    const path = `/js/share/${base64code}`;

    if (base64code !== base64) {
      history.push(path);
    }

    const basePath = window.location.pathname.replace('/', '').length > 0
      ? `${window.location.origin}/${window.location.pathname.replace('/', '')}`
      : `${window.location.origin}`;

    _copyToClipboard(`${basePath}/#${path}`);
  };
  const _removeSnippet = (): void => {
    const filtered = customExamples.filter((value): boolean => value.value !== selected.value);
    const nextOptions = [...filtered, ...snippets];

    setCustomExamples(filtered);
    setIsCustomExample(nextOptions[0].type === 'custom');
    setOptions(sharedExample ? [sharedExample, ...nextOptions] : nextOptions);

    _selectExample(nextOptions[0].value);
    localStorage.setItem(STORE_EXAMPLES, JSON.stringify(filtered));
  };
  const _saveSnippet = (snippetName: string): void => {
    // The <Dropdown> component doesn't take boolean custom props and no
    // camelCase keys, that's why 'custom' is passed as a string here
    const snapshot: Snippet = {
      code,
      label: CUSTOM_LABEL,
      text: snippetName,
      type: 'custom',
      value: `custom-${Date.now()}`
    };
    const nextOptions = [snapshot, ...customExamples, ...snippets];
    const options = selected.type === 'shared'
      ? nextOptions
      : sharedExample
        ? [sharedExample, ...nextOptions]
        : nextOptions;

    localStorage.setItem(STORE_EXAMPLES, JSON.stringify([snapshot, ...customExamples]));

    setCustomExamples([snapshot, ...customExamples]);
    setIsCustomExample(true);
    setOptions(options);
    setSelected(snapshot);
    setSharedExample(selected.type === 'shared' ? undefined : sharedExample);
  };

  const snippetName = selected.type === 'custom' ? selected.text : undefined;

  return (
    <main className={`js--App ${className}`}>
      <header className='container'>
        <Dropdown
          className='js--Dropdown'
          onChange={_selectExample}
          label={t('Select example')}
          options={options}
          value={selected.value}
        />
      </header>
      <section className='js--Content'>
        <Transition
          animation='glow'
          duration={700}
          visible={isAnimated}
        >
          <article className='container js--Editor'>
            <ActionButtons
              generateLink={_generateLink}
              isCustomExample={isCustomExample}
              isRunning={isRunning}
              removeSnippet={_removeSnippet}
              runJs={_runJs}
              saveSnippet={_saveSnippet}
              snippetName={snippetName}
              stopJs={_stopJs}
            />
            <Editor
              code={code}
              onEdit={setCode}
            />
          </article>
        </Transition>
        <Output
          className='js--Output'
          logs={logs}
        >
          <Button
            className='action-button'
            icon='erase'
            isCircular
            isNegative
            onClick={_clearConsole}
          />
        </Output>
      </section>
    </main>
  );
}

const Routed = withRouter(Playground);

export default translate(
  styled(Routed)`
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 1rem 0 0;

    .js--Content {
      align-content: stretch;
      align-items: stretch;
      display: flex;
      height: 100%;
      justify-content: space-between;
      margin-bottom: 0;
    }

    .js--Dropdown {
      margin-right: 100px;
      position: relative;
      z-index: 200;

      .dropdown .menu > .item {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
      }
    }

    .js--Editor,
    .js--Output {
      min-width: 200px;

      .action-button {
        position: absolute;
        right: 0.25rem;
        top: 0.5rem;
        z-index: 100;
      }
    }

    .js--Editor {
      flex-grow: 1;
      overflow: auto;
      padding: 0;
      position: relative;
      resize: horizontal;
      width: 60%;

      textarea {
        outline: 0;
      }

      .codeflask {
        background: transparent;
      }

      .codeflask--has-line-numbers {
        z-index: 0;
      }

      .codeflask--has-line-numbers .codeflask__flatten {
        font-size: 12px;
        line-height: 18px;
        min-width: calc(100% - 40px);
        padding-top: 50px;
        width: auto;
      }

      .codeflask__lines {
        background: #fafafa;
        line-height: 18px;
        padding-top: 50px;
        z-index: 100;
      }

      &::after {
        bottom: 0;
        content: '↔';
        cursor: col-resize;
        font-size: 20px;
        height: 20px;
        line-height: 18px;
        position: absolute;
        right: 0;
        width: 22px;
        z-index: 1;
      }
    }

    .ui.popup.popup-local {
      display: flex;
      flex: 1 1 100%;
      max-width: 300px;

      .button {
        margin: 0;
      }
    }
  `
);
