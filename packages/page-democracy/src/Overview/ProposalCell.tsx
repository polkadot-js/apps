// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash, Proposal, ProposalIndex } from '@polkadot/types/interfaces';

import React from 'react';
import { registry } from '@polkadot/react-api';
import { Call, Expander } from '@polkadot/react-components';
import { Compact } from '@polkadot/types';

import { useTranslation } from '../translate';
import TreasuryCell from './TreasuryCell';

interface Props {
  className?: string;
  imageHash: Hash | string;
  proposal?: Proposal | null;
}

function ProposalCell ({ className, imageHash, proposal }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  if (!proposal) {
    return (
      <td className={`${className} all`}>
        <label>{t('preimage hash')}</label>
        {imageHash.toString()}
      </td>
    );
  }

  const { meta, method, section } = registry.findMetaCall(proposal.callIndex);
  const isTreasury = section === 'treasury' && ['approveProposal', 'rejectProposal'].includes(method);

  return (
    <td className={`${className} all`}>
      <div>{section}.{method}</div>
      <Expander summaryMeta={meta}>
        <Call
          labelHash={t('proposal hash')}
          value={proposal}
          withHash={!isTreasury}
        />
        {isTreasury && (
          <TreasuryCell value={proposal.args[0] as Compact<ProposalIndex>} />
        )}
      </Expander>
    </td>
  );
}

export default React.memo(ProposalCell);
