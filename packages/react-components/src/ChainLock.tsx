// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React, { useContext } from 'react';
import { ApiContext } from '@polkadot/react-api';

import translate from './translate';
import Toggle from './Toggle';

interface Props extends I18nProps {
  className?: string;
  genesisHash: string | null;
  onChange: (genesisHash: string | null) => void;
}

function ChainLock ({ genesisHash, onChange, t }: Props): React.ReactElement<Props> | null {
  const { isDevelopment, api } = useContext(ApiContext);

  if (isDevelopment) {
    return null;
  }

  const isTiedToChain = api.genesisHash.eq(genesisHash);
  const _onChange = (isTiedToChain: boolean): void =>
    onChange(
      isTiedToChain
        ? api.genesisHash.toHex()
        : null
    );

  return (
    <Toggle
      defaultValue={isTiedToChain}
      label={
        isTiedToChain
          ? t('only this network')
          : t('use on any network')
      }
      onChange={_onChange}
    />
  );
}

export default translate(ChainLock);
