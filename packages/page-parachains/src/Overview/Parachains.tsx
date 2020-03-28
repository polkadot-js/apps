// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachain } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';
import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Parachain from './Parachain';

interface Props {
  parachains: DeriveParachain[];
}

function Parachains ({ parachains }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Table>
      <Table.Head>
        <th colSpan={4}>&nbsp;</th>
        <th>{t('swap to id')}</th>
        <th>{t('scheduling')}</th>
      </Table.Head>
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

export default React.memo(styled(Parachains)`
  tbody {
    tr {
      cursor: pointer;
    }
  }
`);
