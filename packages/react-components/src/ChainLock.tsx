// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { useApi } from '@polkadot/react-hooks';
import { chains } from '@polkadot/ui-settings/defaults/chains';

import Toggle from './Toggle';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  genesisHash: string | null;
  isDisabled?: boolean;
  onChange: (genesisHash: string | null) => void;
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

function ChainLock ({ className = '', genesisHash, isDisabled, onChange }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api, isDevelopment } = useApi();

  const isTiedToChain = useMemo(
    () => calcLock(api.genesisHash.toHex(), genesisHash),
    [api, genesisHash]
  );

  const _onChange = useCallback(
    (isTiedToChain: boolean) =>
      onChange(
        isTiedToChain
          ? api.genesisHash.toHex()
          : null
      ),
    [api, onChange]
  );

  if (isDevelopment) {
    return null;
  }

  return (
    <Toggle
      className={className}
      isDisabled={isDisabled}
      label={t<string>('only this network')}
      onChange={_onChange}
      preventDefault
      value={isTiedToChain}
    />
  );
}

export default React.memo(styled(ChainLock)`
  text-align: right;
`);
