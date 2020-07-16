// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Endpoint, EndpointUrl, UseEndpoints } from './types';

import { useCallback, useEffect, useState } from 'react';
import { createEndpoints } from '@polkadot/apps-config/settings';
import uiSettings from '@polkadot/ui-settings';

import { useTranslation } from './translate';

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
function makeUrl (_url: string): EndpointUrl {
  const url = _url.trim();
  const isValid = isValidUrl(url);

  return { isValid, url };
}

// this allows us to retrieve the initial state by reading the settings and the applying
// validation on-top of the values retrieved
function getInitialState (t: <T = string> (key: string) => T): Endpoint {
  const url = uiSettings.get().apiUrl;

  return {
    isCustom: createEndpoints(t).reduce((isCustom: boolean, { value }): boolean => {
      return isCustom && value !== url;
    }, true),
    isValid: isValidUrl(url),
    url
  };
}

export default function useEndpoints (onChange?: (_: string) => void): UseEndpoints {
  const { t } = useTranslation();
  const [info, setInfo] = useState(getInitialState(t));

  useEffect((): void => {
    onChange && info.isValid && onChange(info.url);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  const onChangeUrl = useCallback(
    (url: string): void =>
      setInfo((info: Endpoint) => ({ ...info, ...makeUrl(url) })),
    []
  );

  const onChangeCustom = useCallback(
    (isCustom: boolean): void => setInfo({
      ...makeUrl(
        isCustom
          ? info.url
          : (createEndpoints(t).find(({ value }) => value === info.url) || { value: 'ws://127.0.0.1:9944' }).value as string
      ),
      isCustom
    }),
    [info, t]
  );

  return {
    ...info,
    onChangeCustom,
    onChangeUrl
  };
}