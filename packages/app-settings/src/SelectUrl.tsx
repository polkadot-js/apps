// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { Option } from './types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import store from 'store';
import { Dropdown, Input, Toggle } from '@polkadot/react-components';
import uiSettings, { ICON_DEFAULT, PREFIX_DEFAULT } from '@polkadot/ui-settings';

import translate from './translate';
import { createOption } from './util';

interface Props extends I18nProps {
  className?: string;
  onChange: (url: string) => void;
}

interface StateUrl {
  isValid: boolean;
  url: string;
}

interface State extends StateUrl {
  isCustom: boolean;
}

const hijackSettings = (): void => {
  const ENDPOINT_DEFAULT = 'wss://testnet-node-1.acala.laminar.one/ws';
  const ENDPOINTS = [
    { text: 'Acala Alpha Testnet', value: ENDPOINT_DEFAULT, info: 'substrate' },
    { text: 'Local Node (127.0.0.1:9944)', value: 'ws://127.0.0.1:9944/', info: 'substrate' }
  ];
  const storedSettings = store.get('settings') || {};
  const anySettings = uiSettings as any;
  anySettings._apiUrl = storedSettings.apiUrl || ENDPOINT_DEFAULT;
  anySettings._prefix = storedSettings.prefix || PREFIX_DEFAULT;
  anySettings._icon = storedSettings.icon || ICON_DEFAULT;
  Object.defineProperty(anySettings, 'availableNodes', { value: ENDPOINTS });
};

hijackSettings();

const endpointOptions = uiSettings.availableNodes.map((o): Option => createOption(o, ['local']));

// check the validity of the url
function isValidUrl (url: string): boolean {
  return (
    // some random length... we probably want to parse via some lib
    (url.length >= 7) &&
    // check that it starts with a valid ws identifier
    (url.startsWith('ws://') || url.startsWith('wss://'))
  );
}

// sanitize a url and check it for validity
function makeUrl (_url: string): StateUrl {
  const url = _url.trim();
  const isValid = isValidUrl(url);

  return { isValid, url };
}

// this allows us to retrieve the initial state by reading the settings and the applying
// validation on-top of the values retrieved
function getInitialState (): State {
  const url = uiSettings.get().apiUrl;
  const isCustom = uiSettings.availableNodes.reduce((isCustom: boolean, { value }): boolean => {
    return isCustom && value !== url;
  }, true);
  const isValid = isValidUrl(url);

  return { isCustom, isValid, url };
}

function SelectUrl ({ className, onChange, t }: Props): React.ReactElement<Props> {
  const [info, setInfo] = useState(getInitialState());
  const { isCustom, isValid, url } = info;
  const help = t('Select the remote endpoint, either from the dropdown on manual entered via the custom toggle');
  const label = t('remote node/endpoint to connect to');
  const _onChangeUrl = (url: string): void => setInfo({ ...info, ...makeUrl(url) });
  const _onChangeCustom = (isCustom: boolean): void =>
    setInfo({
      ...makeUrl(
        isCustom
          ? info.url
          : uiSettings.availableNodes[0].value as string
      ),
      isCustom
    });

  useEffect((): void => {
    if (onChange && info.isValid) {
      onChange(info.url);
    }
  }, [info]);

  return (
    <div className={className}>
      <div className='ui--row'>{
        isCustom
          ? <Input
            defaultValue={url}
            help={help}
            isError={!isValid}
            label={label}
            onChange={_onChangeUrl}
          />
          : <Dropdown
            defaultValue={url}
            help={help}
            label={label}
            onChange={_onChangeUrl}
            options={endpointOptions}
          />
      }</div>
      <Toggle
        className='settings--customToggle'
        defaultValue={isCustom}
        label={t('custom endpoint')}
        onChange={_onChangeCustom}
      />
    </div>
  );
}

export default translate(
  styled(SelectUrl)`
    position: relative;

    .settings--customToggle {
      position: absolute;
      top: .5rem;
      right: 3.5rem;
    }
  `
);
