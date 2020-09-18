// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveProposalImage } from '@polkadot/api-derive/types';
import { Hash } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { CallExpander } from '@polkadot/react-components';
import { Holder } from '@polkadot/react-params';

import { useTranslation } from '../translate';

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
        labelHash={t<string>('proposal hash')}
        value={preimage.proposal}
        withHash
      />
    </Holder>
  );
}

export default React.memo(ExternalCell);
