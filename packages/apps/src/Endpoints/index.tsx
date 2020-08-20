// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import type { LinkOption } from '@polkadot/apps-config/settings/endpoints';
import { Endpoint } from './types';

import React, { useCallback, useMemo, useState } from 'react';
// ok, this seems to be an eslint bug, this _is_ a package import
/* eslint-disable-next-line node/no-deprecated-api */
import punycode from 'punycode';
import styled from 'styled-components';
import { createEndpoints, CUSTOM_ENDPOINT_KEY } from '@polkadot/apps-config/settings';
import { Button, Input, Sidebar } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';
import { isAscii } from '@polkadot/util';

import { useTranslation } from '../translate';
import EndpointDisplay from './Endpoint';

interface Props {
  className?: string;
  offset?: number | string;
  onClose: () => void;
}

interface UrlState {
  apiUrl: string;
  hasUrlChanged: boolean;
  isUrlValid: boolean;
}

function textToParts (text: string): [string, string, string] {
  const [first, remainder] = text.replace(')', '').split(' (');
  const [middle, last] = remainder.split(', ');

  return [first, middle, last];
}

function isValidUrl (url: string): boolean {
  return (
    // some random length... we probably want to parse via some lib
    (url.length >= 7) &&
    // check that it starts with a valid ws identifier
    (url.startsWith('ws://') || url.startsWith('wss://'))
  );
}

function combineEndpoints (endpoints: LinkOption[]): Endpoint[] {
  return endpoints.reduce((result: Endpoint[], e): Endpoint[] => {
    if (e.isHeader) {
      result.push({ header: e.text, networks: [] });
    } else {
      const [name, , providerName] = textToParts(e.text as string);
      const prev = result[result.length - 1];
      const prov = { name: providerName, url: e.value as string };

      if (prev.networks[prev.networks.length - 1] && name === prev.networks[prev.networks.length - 1].name) {
        prev.networks[prev.networks.length - 1].providers.push(prov);
      } else {
        prev.networks.push({
          icon: e.info,
          isChild: e.isChild,
          name,
          providers: [prov]
        });
      }
    }

    return result;
  }, []);
}

function getCustomEndpoints (): string[] {
  try {
    const storedAsset = localStorage.getItem(CUSTOM_ENDPOINT_KEY);

    if (storedAsset) {
      return JSON.parse(storedAsset) as string[];
    }
  } catch (e) {
    console.error(e);
    // ignore error
  }

  return [];
}

function Endpoints ({ className = '', offset, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const linkOptions = createEndpoints(t);
  const [endpoints, setEndpoints] = useState(combineEndpoints(linkOptions));
  const [{ apiUrl, hasUrlChanged, isUrlValid }, setApiUrl] = useState<UrlState>({ apiUrl: uiSettings.get().apiUrl, hasUrlChanged: false, isUrlValid: true });
  const [storedCustomEndpoints, setStoredCustomEndpoints] = useState<string[]>(getCustomEndpoints());
  const isKnownUrl = useMemo(() => {
    let result = false;

    linkOptions.some((endpoint) => {
      if (endpoint.value === apiUrl) {
        result = true;

        return true;
      }

      return false;
    });

    return result;
  }, [apiUrl, linkOptions]);

  const isSavedCustomEndpoint = useMemo(() => {
    let result = false;

    storedCustomEndpoints.some((endpoint) => {
      if (endpoint === apiUrl) {
        result = true;

        return true;
      }

      return false;
    });

    return result;
  }, [apiUrl, storedCustomEndpoints]);

  const _saveApiEndpoint = () => {
    try {
      localStorage.setItem(CUSTOM_ENDPOINT_KEY, JSON.stringify([...storedCustomEndpoints, apiUrl]));
      _onApply();
    } catch (e) {
      console.error(e);
      // ignore error
    }
  };

  const _removeApiEndpoint = () => {
    if (!isSavedCustomEndpoint) return;

    const newStoredCurstomEndpoints = storedCustomEndpoints.filter((url) => url !== apiUrl);

    try {
      localStorage.setItem(CUSTOM_ENDPOINT_KEY, JSON.stringify(newStoredCurstomEndpoints));
      setEndpoints(combineEndpoints(createEndpoints(t)));
      setStoredCustomEndpoints(getCustomEndpoints());
    } catch (e) {
      console.error(e);
      // ignore error
    }
  };

  const _setApiUrl = useCallback(
    (apiUrl: string) => setApiUrl({ apiUrl, hasUrlChanged: uiSettings.get().apiUrl !== apiUrl, isUrlValid: true }),
    []
  );

  const _onChangeCustom = useCallback(
    (apiUrl: string): void => {
      if (!isAscii(apiUrl)) {
        apiUrl = punycode.toASCII(apiUrl);
      }

      setApiUrl({ apiUrl, hasUrlChanged: uiSettings.get().apiUrl !== apiUrl, isUrlValid: isValidUrl(apiUrl) });
    },
    []
  );

  const _onApply = useCallback(
    (): void => {
      uiSettings.set({ ...(uiSettings.get()), apiUrl });
      window.location.reload();

      onClose();
    },
    [apiUrl, onClose]
  );

  return (
    <Sidebar
      button={
        <Button
          icon='sync'
          isDisabled={!(hasUrlChanged && isUrlValid)}
          label={t<string>('Switch')}
          onClick={_onApply}
        />
      }
      className={className}
      offset={offset}
      onClose={onClose}
      position='left'
    >
      {endpoints.map((endpoint, index): React.ReactNode => (
        <EndpointDisplay
          apiUrl={apiUrl}
          key={index}
          setApiUrl={_setApiUrl}
          value={endpoint}
        />
      ))}
      <div className='endpointCustomWrapper'>
        <Input
          className='endpointCustom'
          isError={!isUrlValid}
          isFull
          label={t<string>('custom endpoint')}
          onChange={_onChangeCustom}
          value={apiUrl}
        />
        {isSavedCustomEndpoint
          ? <Button
            className='customButton'
            icon='trash-alt'
            onClick={_removeApiEndpoint}
          />
          : <Button
            className='customButton'
            icon='save'
            isDisabled={!isUrlValid || isKnownUrl}
            onClick={_saveApiEndpoint}
          />
        }
      </div>
    </Sidebar>
  );
}

export default React.memo(styled(Endpoints)`
  .customButton {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .endpointCustom {
    margin-top: 0.5rem;

    input {
      padding-right: 4rem;
    }
  }

  .endpointCustomWrapper {
    position: relative;
  }
`);
