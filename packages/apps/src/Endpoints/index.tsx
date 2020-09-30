// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/settings/endpoints';
import { Group } from './types';

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
import GroupDisplay from './Group';

interface Props {
  className?: string;
  offset?: number | string;
  onClose: () => void;
}

interface UrlState {
  apiUrl: string;
  groupIndex: number;
  hasUrlChanged: boolean;
  isUrlValid: boolean;
}

function isValidUrl (url: string): boolean {
  return (
    // some random length... we probably want to parse via some lib
    (url.length >= 7) &&
    // check that it starts with a valid ws identifier
    (url.startsWith('ws://') || url.startsWith('wss://'))
  );
}

function combineEndpoints (endpoints: LinkOption[]): Group[] {
  return endpoints.reduce((result: Group[], e): Group[] => {
    if (e.isHeader) {
      result.push({ header: e.text, isDevelopment: e.isDevelopment, networks: [] });
    } else {
      const prev = result[result.length - 1];
      const prov = { name: e.textHoster, url: e.value as string };

      if (prev.networks[prev.networks.length - 1] && e.text === prev.networks[prev.networks.length - 1].name) {
        prev.networks[prev.networks.length - 1].providers.push(prov);
      } else {
        prev.networks.push({
          icon: e.info,
          isChild: e.isChild,
          name: e.text as string,
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

function extractUrlState (apiUrl: string, groups: Group[]): UrlState {
  let groupIndex = groups.findIndex(({ networks }) =>
    networks.some(({ providers }) =>
      providers.some(({ url }) => url === apiUrl)
    )
  );

  if (groupIndex === -1) {
    groupIndex = groups.findIndex(({ isDevelopment }) => isDevelopment);
  }

  return {
    apiUrl,
    groupIndex,
    hasUrlChanged: uiSettings.get().apiUrl !== apiUrl,
    isUrlValid: isValidUrl(apiUrl)
  };
}

function Endpoints ({ className = '', offset, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const linkOptions = createEndpoints(t);
  const [groups, setGroups] = useState(combineEndpoints(linkOptions));
  const [{ apiUrl, groupIndex, hasUrlChanged, isUrlValid }, setApiUrl] = useState<UrlState>(extractUrlState(uiSettings.get().apiUrl, groups));
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

  const _changeGroup = useCallback(
    (groupIndex: number) => setApiUrl((state) => ({ ...state, groupIndex })),
    []
  );

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
      setGroups(combineEndpoints(createEndpoints(t)));
      setStoredCustomEndpoints(getCustomEndpoints());
    } catch (e) {
      console.error(e);
      // ignore error
    }
  };

  const _setApiUrl = useCallback(
    (apiUrl: string) => setApiUrl(extractUrlState(apiUrl, groups)),
    [groups]
  );

  const _onChangeCustom = useCallback(
    (apiUrl: string): void => {
      if (!isAscii(apiUrl)) {
        apiUrl = punycode.toASCII(apiUrl);
      }

      setApiUrl(extractUrlState(apiUrl, groups));
    },
    [groups]
  );

  const _onApply = useCallback(
    (): void => {
      uiSettings.set({ ...(uiSettings.get()), apiUrl });

      window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(apiUrl)}${window.location.hash}`);
      // window.location.reload();

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
      {groups.map((group, index): React.ReactNode => (
        <GroupDisplay
          apiUrl={apiUrl}
          index={index}
          isSelected={groupIndex === index}
          key={index}
          setApiUrl={_setApiUrl}
          setGroup={_changeGroup}
          value={group}
        >
          {group.isDevelopment && (
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
          )}
        </GroupDisplay>
      ))}
    </Sidebar>
  );
}

export default React.memo(styled(Endpoints)`
  color: #4e4e4e;
  padding-top: 3.5rem;

  .customButton {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .endpointCustom {
    input {
      padding-right: 4rem;
    }
  }

  .endpointCustomWrapper {
    position: relative;
  }
`);
