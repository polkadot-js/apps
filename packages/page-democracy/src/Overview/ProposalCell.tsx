// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { FunctionMetadataLatest, Hash, Proposal } from '@polkadot/types/interfaces';

import React from 'react';
import { registry } from '@polkadot/react-api';
import { Call, Expander } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  proposal?: Proposal | null;
  proposalHash: Hash | string;
}

function formatDocs (meta?: FunctionMetadataLatest): React.ReactNode | null {
  if (!meta) {
    return null;
  }

  const strings = meta.documentation.map((doc): string => doc.toString().trim());
  const firstEmpty = strings.findIndex((doc): boolean => !doc.length);

  if (!firstEmpty) {
    return null;
  }

  return strings.slice(0, firstEmpty).join(' ');
}

function ProposalCell ({ className, proposal, proposalHash }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  if (!proposal) {
    return (
      <td className={`${className} all top`}>
        <label>{t('preimage hash')}</label>
        {proposalHash.toString()}
      </td>
    );
  }

  const { meta, method, section } = registry.findMetaCall(proposal.callIndex);

  return (
    <td className={`${className} all top`}>
      <div>{section}.{method}</div>
      <Expander summary={formatDocs(meta) || t('Details')}>
        <Call
          labelHash={t('proposal hash')}
          value={proposal}
          withHash
        />
      </Expander>
    </td>
  );
}

export default React.memo(ProposalCell);
