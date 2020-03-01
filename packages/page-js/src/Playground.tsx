// Copyright 2017-2020 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { KeyringInstance } from '@polkadot/keyring/types';
import { ApiProps } from '@polkadot/react-api/types';
import { AppProps as Props } from '@polkadot/react-components/types';
import { Log, LogType, Snippet } from './types';

import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Editor } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import uiKeyring from '@polkadot/ui-keyring';
import * as types from '@polkadot/types';
import * as util from '@polkadot/util';
import * as hashing from '@polkadot/util-crypto';

import { STORE_EXAMPLES, STORE_SELECTED, CUSTOM_LABEL } from './constants';
import makeWrapper from './snippets/wrapping';
import allSnippets from './snippets';
import { useTranslation } from './translate';

import Output from './Output';
import ActionButtons from './ActionButtons';

interface Injected {
  api: ApiPromise;
  console: {
    error: (...args: any[]) => void;
    log: (...args: any[]) => void;
  };
  hashing: typeof hashing;
  keyring: KeyringInstance | null;
  setIsRunning: (isRunning: boolean) => void;
  types: typeof types;
  util: typeof util;
  [name: string]: any;
}

const ALLOWED_GLOBALS = ['atob', 'btoa'];
const snippets: Snippet[] = JSON.parse(JSON.stringify(allSnippets));
let hasSnippetWrappers = false;

function setupInjected ({ api, isDevelopment }: ApiProps, setIsRunning: (isRunning: boolean) => void, hookConsole: (type: LogType, args: any[]) => void): Injected {
  const nullObject = Object
    .keys(window)
    .filter((key): boolean => !key.includes('-') && !ALLOWED_GLOBALS.includes(key))
    .reduce((result: Record<string, null>, key): Record<string, null> => {
      result[key] = null;

      return result;
    }, { global: null, window: null });

  return {
    ...nullObject,
    api: api.clone(),
    console: {
      error: (...args: any[]): void => hookConsole('error', args),
      log: (...args: any[]): void => hookConsole('log', args)
    },
    hashing,
    keyring: isDevelopment
      ? uiKeyring.keyring
      : null,
    setIsRunning,
    types,
    util
  };
}

// FIXME This... ladies & gentlemen, is a mess that should be untangled
function Playground ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const apiProps = useApi();
  const injectedRef = useRef<Injected | null>(null);
  const [code, setCode] = useState('');
  const [isCustomExample, setIsCustomExample] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [customExamples, setCustomExamples] = useState<Snippet[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [options, setOptions] = useState<Snippet[]>([]);
  const [selected, setSelected] = useState(snippets[0]);

  // initialize all options
  useEffect((): void => {
    // add snippets if not already available (global)
    if (!hasSnippetWrappers) {
      snippets.forEach((snippet): void => {
        snippet.code = `${makeWrapper(apiProps.isDevelopment)}${snippet.code}`;
      });

      hasSnippetWrappers = true;
    }

    const localData = {
      examples: localStorage.getItem(STORE_EXAMPLES),
      selectedValue: localStorage.getItem(STORE_SELECTED)
    };
    const customExamples = localData.examples ? JSON.parse(localData.examples) : [];
    const options: Snippet[] = [...customExamples, ...snippets];
    const selected = options.find((option): boolean => option.value === localData.selectedValue);

    setCustomExamples(customExamples);
    setIsCustomExample((selected && selected.type === 'custom') || false);
    setOptions(options);
    setSelected(selected || snippets[0]);
  }, []);

  useEffect((): void => {
    setCode(selected.code);
  }, [selected]);

  const _clearConsole = (): void => setLogs([]);
  const _hookConsole = (type: LogType, args: any[]): void => {
    logs.push({ args, type });
    setLogs(logs.slice(0));
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

    injectedRef.current = setupInjected(apiProps, setIsRunning, _hookConsole);

    await injectedRef.current.api.isReady;

    try {
      // squash into a single line so exceptions (with line numbers) maps to the
      // same line/origin as we have in the editor view
      // TODO: Make the console.error here actually return the full stack
      const exec = `(async ({${Object.keys(injectedRef.current).sort().join(',')}}) => { try { ${code} \n } catch (error) { console.error(error); setIsRunning(false); } })(injected);`;

      // eslint-disable-next-line no-new-func
      new Function('injected', exec).bind({}, injectedRef.current)();
    } catch (error) {
      injectedRef.current.console.error(error);
    }

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
  const _removeSnippet = (): void => {
    const filtered = customExamples.filter((value): boolean => value.value !== selected.value);
    const nextOptions = [...filtered, ...snippets];

    setCustomExamples(filtered);
    setIsCustomExample(nextOptions[0].type === 'custom');
    setOptions(nextOptions);
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
    const options = [snapshot, ...customExamples, ...snippets];

    localStorage.setItem(STORE_EXAMPLES, JSON.stringify([snapshot, ...customExamples]));
    setCustomExamples([snapshot, ...customExamples]);
    setIsCustomExample(true);
    setOptions(options);
    setSelected(snapshot);
  };

  const snippetName = selected.type === 'custom' ? selected.text : undefined;

  return (
    <main className={`js--App ${className}`}>
      <header className='container'>
        <Dropdown
          className='js--Dropdown'
          isFull
          onChange={_selectExample}
          label={t('Select example')}
          options={options}
          value={selected.value}
        />
      </header>
      <section className='js--Content'>
        <article className='container js--Editor'>
          <ActionButtons
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

export default styled(Playground)`
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
`;
