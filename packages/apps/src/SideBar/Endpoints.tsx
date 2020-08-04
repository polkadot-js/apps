// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import type { LinkOption } from '@polkadot/apps-config/settings/endpoints';

import React, { useCallback, useState } from 'react';
// ok, this seems to be an eslint bug, this _is_ a package import
/* eslint-disable-next-line node/no-deprecated-api */
import punycode from 'punycode';
import styled from 'styled-components';
import { createEndpoints } from '@polkadot/apps-config/settings';
import { Button, ChainImg, Icon, Input, Sidebar, Toggle } from '@polkadot/react-components';
import uiSettings from '@polkadot/ui-settings';
import { isAscii } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Endpoint {
  header: React.ReactNode;
  networks: {
    icon?: string;
    isChild?: boolean;
    name: string;
    providers: {
      name: string;
      url: string;
    }[]
  }[];
}

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

function Endpoints ({ className = '', offset, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [endpoints] = useState(combineEndpoints(createEndpoints(t)));
  const [{ apiUrl, hasUrlChanged, isUrlValid }, setApiUrl] = useState<UrlState>({ apiUrl: uiSettings.get().apiUrl, hasUrlChanged: false, isUrlValid: true });
  const [openIndex, setOpenIndex] = useState('');

  const _setApiUrl = useCallback(
    (apiUrl: string) => () => setApiUrl({ apiUrl, hasUrlChanged: uiSettings.get().apiUrl !== apiUrl, isUrlValid: true }),
    []
  );

  const _setOpenIndex = useCallback(
    (index: string) => () => setOpenIndex((openIndex) => openIndex === index ? '' : index),
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
      {endpoints.map(({ header, networks }, typeIndex): React.ReactNode => (
        <div
          className='endpointType'
          key={typeIndex}
        >
          <div className='endpointHeader'>{header}</div>
          {networks.map(({ icon, isChild, name, providers }, netIndex): React.ReactNode => {
            const isSelected = providers.some(({ url }) => url === apiUrl);
            const index = `${typeIndex}:${netIndex}`;
            const isOpen = openIndex === index;

            return (
              <div
                className={`endpointGroup${isOpen ? ' isOpen' : ''}${isSelected ? ' isSelected ui--highlight--before' : ''}`}
                key={index}
                onClick={_setOpenIndex(index)}
              >
                <div className={`endpointSection${isChild ? ' isChild' : ''}`}>
                  <ChainImg
                    className='endpointIcon'
                    logo={icon === 'local' ? 'empty' : icon}
                  />
                  <div className='endpointValue'>{name}</div>
                  {!isSelected && (
                    <Icon
                      className='endpointOpen'
                      icon={isOpen ? 'caret-up' : 'caret-down'}
                    />
                  )}
                </div>
                {providers.map(({ name, url }): React.ReactNode => (
                  <Toggle
                    className='endpointProvider'
                    isRadio
                    key={url}
                    label={name}
                    onChange={_setApiUrl(url)}
                    value={apiUrl === url}
                  />
                ))}
              </div>
            );
          })}
        </div>
      ))}
      <Input
        className='endpointCustom'
        isError={!isUrlValid}
        isFull
        label={t<string>('custom endpoint')}
        onChange={_onChangeCustom}
        value={apiUrl}
      />
    </Sidebar>
  );
}

export default React.memo(styled(Endpoints)`
  .endpointCustom {
    margin-top: 0.5rem;
  }

  .endpointType {
    margin-top: 2rem;

    &+.endpointType {
      margin-top: 1rem;
    }
  }

  .endpointGroup {
    border-radius: 0.25rem;
    cursor: pointer;
    margin: 0 0 0.25rem 0;
    padding: 0.375rem;
    position: relative;

    &.isOpen,
    &.isSelected {
      .endpointProvider {
        display: block;
      }
    }

    &.isSelected,
    &:hover {
      background: #fffefd;
    }
  }

  .endpointHeader {
    font-size: 0.78571429em;
    font-weight: 700;
    line-height: 1;
    padding: 0.5rem 0 1rem;
    text-transform: uppercase;
  }

  .endpointIcon {
    height: 24px;
    margin-right: 0.75rem;
    width: 24px;
  }

  .endpointProvider {
    display: none;
    padding: 0.25rem;
    text-align: right;
  }

  .endpointSection {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    position: relative;

    &.isChild .endpointIcon {
      margin-left: 1.25rem;
    }

    .endpointOpen {
      position: absolute;
      right: 0.5rem;
      top: 0.375rem;
    }

    &+.endpointProvider {
      margin-top: -0.125rem;
    }
  }
`);
