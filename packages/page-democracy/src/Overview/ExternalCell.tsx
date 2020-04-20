// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposalImage } from '@polkadot/api-derive/types';
import { Hash } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { CallExpander } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  value: Hash;
}

function ExternalCell ({ className, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const preimage = useCall<DeriveProposalImage>(api.derive.democracy.preimage, [value]);

  if (!preimage?.proposal) {
    return null;
  }

  return (
    <CallExpander
      className={className}
      labelHash={t('proposal hash')}
      value={preimage.proposal}
      withBorder
      withHash
    />
  );
}

export default React.memo(ExternalCell);
