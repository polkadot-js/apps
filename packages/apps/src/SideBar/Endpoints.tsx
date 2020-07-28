// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '@polkadot/apps-config/settings/types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { createEndpoints } from '@polkadot/apps-config/settings';
import { ChainImg, Sidebar, Toggle } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Endpoint {
  header: React.ReactNode;
  networks: {
    icon?: string;
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

function textToParts (text: string): [string, string, string] {
  const [first, remainder] = text.replace(')', '').split(' (');
  const [middle, last] = remainder.split(', ');

  return [first, middle, last];
}

function combineEndpoints (endpoints: Option[]): Endpoint[] {
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

  return (
    <Sidebar
      className={className}
      offset={offset}
      onClose={onClose}
      position='left'
    >
      {endpoints.map(({ header, networks }, index): React.ReactNode => (
        <div
          className='endpointType'
          key={index}
        >
          <div className='endpointHeader'>{header}</div>
          {networks.map(({ icon, name, providers }, index): React.ReactNode => (
            <div
              className='endpointGroup'
              key={index}
            >
              <div
                className='endpointSection'
                key={index}
              >
                <ChainImg
                  className='endpointIcon'
                  logo={icon === 'local' ? 'empty' : icon}
                />
                <div className='endpointValue'>{name}</div>
              </div>
              {providers.map(({ name, url }): React.ReactNode => (
                <Toggle
                  className='endpointProvider'
                  key={url}
                  label={name}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </Sidebar>
  );
}

export default React.memo(styled(Endpoints)`
  .endpointType {
  }

  .endpointGroup {}

  .endpointHeader {
    font-size: 0.78571429em;
    font-weight: 700;
    line-height: 1;
    padding: 0.75rem 0;
    text-transform: uppercase;
  }

  .endpointIcon {
    height: 32px;
    margin-right: 0.75rem;
    width: 32px;
  }

  .endpointProvider {
    padding: 0.25rem;
    text-align: right;
  }

  .endpointSection {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    margin: 0.25rem 0 -0.5rem;
  }
`);
