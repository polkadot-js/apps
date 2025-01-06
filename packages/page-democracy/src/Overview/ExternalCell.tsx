// Copyright 2017-2025 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveProposalImage } from '@polkadot/api-derive/types';
import type { Hash } from '@polkadot/types/interfaces';

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { CallExpander, Holder } from '@polkadot/react-params';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  value: Hash;
}

function ExternalCell ({ className = '', value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const preimage = useCall<DeriveProposalImage>(api.derive.democracy.preimage, [value]);

  if (!preimage?.proposal) {
    return null;
  }

  return (
    <Holder
      className={className}
      withBorder
      withPadding
    >
      <CallExpander
        labelHash={t('proposal hash')}
        value={preimage.proposal}
        withHash
      />
    </Holder>
  );
}

export default React.memo(ExternalCell);
