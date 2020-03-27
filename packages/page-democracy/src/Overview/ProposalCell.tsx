// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposalImage } from '@polkadot/api-derive/types';
import { Hash } from '@polkadot/types/interfaces';

import React from 'react';
import { registry } from '@polkadot/react-api';
import { Call, Expander } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  image?: DeriveProposalImage | null;
  imageHash: Hash | string;
}

function ProposalCell ({ className, image, imageHash }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  if (!image?.proposal) {
    return (
      <td className={`${className} all top`}>
        <label>{t('preimage hash')}</label>
        {imageHash.toString()}
      </td>
    );
  }

  const { meta, method, section } = registry.findMetaCall(image.proposal.callIndex);

  return (
    <td className={`${className} all top`}>
      <div>{section}.{method}</div>
      <Expander summaryMeta={meta}>
        <Call
          labelHash={t('proposal hash')}
          value={image.proposal}
          withHash
        />
      </Expander>
    </td>
  );
}

export default React.memo(ProposalCell);
