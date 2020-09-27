// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveProposalExternal } from '@polkadot/api-derive/types';

import React, { useRef } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import External from './External';

interface Props {
  className?: string;
}

function Externals ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const external = useCall<DeriveProposalExternal | null>(api.derive.democracy.nextExternal);

  const headerRef = useRef([
    [t('external'), 'start'],
    [t('proposer'), 'address'],
    [t('locked')],
    []
  ]);

  return (
    <Table
      className={className}
      empty={external === null && t<string>('No external proposal')}
      header={headerRef.current}
    >
      {external && <External value={external} />}
    </Table>
  );
}

export default React.memo(Externals);
