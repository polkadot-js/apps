// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash, Proposal } from '@polkadot/types/interfaces';

import React from 'react';
import { registry } from '@polkadot/react-api';
import { Call } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  proposal?: Proposal | null;
  proposalHash: Hash | string;
}

export default function ProposalCell ({ className, proposal, proposalHash }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  if (!proposal) {
    return (
      <td className={`${className} all`}>
        <label>{t('proposal hash')}</label>
        {proposalHash.toString()}
      </td>
    );
  }

  const { meta, method, section } = registry.findMetaCall(proposal.callIndex);

  return (
    <td className={`${className} all`}>
      <div>{section}.{method}</div>
      <details>
        <summary>{meta?.documentation.join(' ') || t('Details')}</summary>
        <Call
          labelHash={t('proposal hash')}
          value={proposal}
          withHash
        />
      </details>
    </td>
  );
}
