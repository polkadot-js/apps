// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachain } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';
import { Table } from '@polkadot/react-components';

import Parachain from './Parachain';

interface Props {
  parachains: DeriveParachain[];
}

function Parachains ({ parachains }: Props): React.ReactElement<Props> {
  return (
    <Table>
      <Table.Body>
        {parachains.map((parachain): React.ReactNode => (
          <Parachain
            key={parachain.id.toString()}
            parachain={parachain}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

export default styled(Parachains)`
tbody {
  tr {
    cursor: pointer;
  }
}`;
