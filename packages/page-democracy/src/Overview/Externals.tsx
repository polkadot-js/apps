// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposalExternal } from '@polkadot/api-derive/types';

import React from 'react';
import { Spinner, Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import External from './External';

interface Props {
  className?: string;
}

function Externals ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const external = useCall<DeriveProposalExternal | null>(api.derive.democracy.nextExternal, []);

  return (
    <div className={`proposalSection ${className}`}>
      <h1>{t('external')}</h1>
      {external
        ? (
          <Table>
            <Table.Head>
              <th>&nbsp;</th>
              <th className='address'>{t('proposer')}</th>
              <th>{t('locked')}</th>
              <th>&nbsp;</th>
            </Table.Head>
            <Table.Body>
              <External value={external} />
            </Table.Body>
          </Table>
        )
        : external === null
          ? <div>{t('No external proposal')}</div>
          : <Spinner />
      }
    </div>
  );
}

export default React.memo(Externals);
