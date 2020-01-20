// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useApi } from '@polkadot/react-hooks';
import chains from '@polkadot/ui-settings/defaults/chains';

import { useTranslation } from './translate';
import Toggle from './Toggle';

interface Props {
  className?: string;
  genesisHash: string | null;
  isDisabled?: boolean;
  onChange: (genesisHash: string | null) => void;
  preventDefault?: boolean;
}

function calcLock (apiGenesis: string, genesisHash: string | null): boolean {
  if (!genesisHash) {
    return false;
  }

  return (
    Object.values(chains).find((hashes): boolean =>
      hashes.includes(apiGenesis)
    ) || [apiGenesis]
  ).includes(genesisHash);
}

function ChainLock ({ className, genesisHash, isDisabled, onChange, preventDefault }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { isDevelopment, api } = useApi();
  const [isTiedToChain, setTied] = useState(calcLock(api.genesisHash.toHex(), genesisHash));

  useEffect((): void => {
    setTied(calcLock(api.genesisHash.toHex(), genesisHash));
  }, [api, genesisHash]);

  if (isDevelopment) {
    return null;
  }

  const _onChange = (isTiedToChain: boolean): void =>
    onChange(
      isTiedToChain
        ? api.genesisHash.toHex()
        : null
    );

  return (
    <Toggle
      className={className}
      isDisabled={isDisabled}
      label={
        isTiedToChain
          ? t('only this network')
          : t('use on any network')
      }
      onChange={_onChange}
      preventDefault={preventDefault}
      value={isTiedToChain}
    />
  );
}

export default styled(ChainLock)`
  text-align: right;
`;
