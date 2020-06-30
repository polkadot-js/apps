// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposal } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import ProposalDisplay from './Proposal';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Proposals ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const proposals = useCall<DeriveProposal[]>(api.derive.democracy.proposals, []);

  const header = useMemo(() => [
    [t('proposals'), 'start', 2],
    [t('proposer'), 'address'],
    [t('locked'), 'ui--media-1200'],
    [undefined, undefined, 2],
    [undefined, 'mini ui--media-1000']
  ], [t]);

  return (
    <Table
      className={className}
      empty={proposals && t<string>('No active proposals')}
      header={header}
    >
      {proposals?.map((proposal): React.ReactNode => (
        <ProposalDisplay
          key={proposal.index.toString()}
          value={proposal}
        />
      ))}
    </Table>
  );
}

export default React.memo(Proposals);
