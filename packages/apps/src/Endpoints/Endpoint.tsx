// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Endpoint } from './types';

import React from 'react';
import styled from 'styled-components';

import Network from './Network';

interface Props {
  apiUrl: string;
  className?: string;
  setApiUrl: (apiUrl: string) => void;
  value: Endpoint;
}

function EndpointDisplay ({ apiUrl, className, setApiUrl, value: { header, networks } }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <div className='endpointHeader'>{header}</div>
      {networks.map((network, index): React.ReactNode => (
        <Network
          apiUrl={apiUrl}
          key={index}
          setApiUrl={setApiUrl}
          value={network}
        />
      ))}
    </div>
  );
}

export default React.memo(styled(EndpointDisplay)`
  margin-top: 2rem;

  &+& {
    margin-top: 1rem;
  }

  .endpointHeader {
    font-size: 0.78571429em;
    font-weight: 700;
    line-height: 1;
    padding: 0.5rem 0 1rem;
    text-transform: uppercase;
  }
`);
