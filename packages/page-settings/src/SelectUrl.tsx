// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TFunction } from 'i18next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { createEndpoints } from '@polkadot/apps-config/settings';
import { Dropdown, Input, Toggle } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';

import { useTranslation } from './translate';
import { createOption } from './util';

interface Props {
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
function getInitialState (t: TFunction): State {
  const url = uiSettings.get().apiUrl;

  return {
    isCustom: createEndpoints(t).reduce((isCustom: boolean, { value }): boolean => {
      return isCustom && value !== url;
    }, true),
    isValid: isValidUrl(url),
    url
  };
}

function SelectUrl ({ className = '', onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [info, setInfo] = useState(getInitialState(t));
  const { isCustom, isValid, url } = info;
  const translatedEndpoints = useMemo(
    () => createEndpoints(t).map((option) => createOption(option, ['local'])),
    [t]
  );

  useEffect((): void => {
    onChange && info.isValid && onChange(info.url);
  // the issue here is that the onChange callback changes each and every render... so Houston, we have
  // a desperate issue here :(
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  const _onChangeUrl = useCallback(
    (url: string) => setInfo((info: State) => ({ ...info, ...makeUrl(url) })),
    []
  );

  const _onChangeCustom = useCallback(
    (isCustom: boolean) => setInfo({
      ...makeUrl(
        isCustom
          ? info.url
          : (createEndpoints(t).find(({ value }) => !!value) || { value: 'ws://127.0.0.1:9944' }).value as string
      ),
      isCustom
    }),
    [info, t]
  );

  const help = t<string>('Select the remote endpoint, either from the dropdown on manual entered via the custom toggle');
  const label = t<string>('remote node/endpoint to connect to');

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
            options={translatedEndpoints}
          />
      }</div>
      <Toggle
        className='settings--customToggle'
        label={t<string>('custom endpoint')}
        onChange={_onChangeCustom}
        value={isCustom}
      />
    </div>
  );
}

export default React.memo(styled(SelectUrl)`
  position: relative;

  .settings--customToggle {
    position: absolute;
    bottom: 1.375rem;
    right: 3.5rem;
  }
`);
