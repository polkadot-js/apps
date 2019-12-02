// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Proposal } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { registry } from '@polkadot/react-api';
import { Call } from '@polkadot/react-components';

import translate from '../translate';

interface Props extends I18nProps {
  proposal: Proposal;
}

function ProposalCell ({ className, proposal, t }: Props): React.ReactElement<Props> {
  const { meta, method, section } = registry.findMetaCall(proposal.callIndex);

  return (
    <td className={`${className} all`}>
      <div>{section}.{method}</div>
      <details>
        <summary>{
          meta && meta.documentation
            ? meta.documentation.join(' ')
            : t('Details')
        }</summary>
        <Call
          labelHash={t('proposal hash')}
          value={proposal}
          withHash
        />
      </details>
    </td>
  );
}

export default translate(ProposalCell);
