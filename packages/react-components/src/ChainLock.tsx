// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { useApiContext } from '@polkadot/react-hooks';

import translate from './translate';
import Toggle from './Toggle';

interface Props extends I18nProps {
  className?: string;
  genesisHash: string | null;
  isDisabled?: boolean;
  onChange: (genesisHash: string | null) => void;
  preventDefault?: boolean;
}

function ChainLock ({ className, genesisHash, isDisabled, onChange, preventDefault, t }: Props): React.ReactElement<Props> | null {
  const { isDevelopment, api } = useApiContext();

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
      className={className}
      defaultValue={isTiedToChain}
      isDisabled={isDisabled}
      label={
        isTiedToChain
          ? t('only this network')
          : t('use on any network')
      }
      onChange={_onChange}
      preventDefault={preventDefault}
    />
  );
}

export default translate(
  styled(ChainLock)`
    text-align: right;
  `
);
