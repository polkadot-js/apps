// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React from 'react';

import { rpcNetwork } from '@polkadot/react-api/util/getEnvironment';
import { Bonded } from '@polkadot/react-query';

import { renderProvided } from './Balance';
import { useTranslation } from './translate';

export interface Props {
  bonded?: BN | BN[];
  className?: string;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  withLabel?: boolean;
}

function BondedDisplay (props: Props): React.ReactElement<Props> | null {
  const { bonded, className = '', label, params } = props;
  const { t } = useTranslation();
  const isDarwiniaPower = rpcNetwork.isDarwinia();

  if (!params) {
    return null;
  }

  return bonded
    ? <>{renderProvided({ className, isDarwiniaPower, label, powerUnit: t('power', 'power'), value: bonded })}</>
    : (
      <Bonded
        className={`${className} ui--Bonded`}
        label={label}
        params={params}
      />
    );
}

export default React.memo(BondedDisplay);
