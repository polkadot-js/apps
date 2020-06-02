// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { VoidFn } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { InputNumber } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isContract?: boolean;
  isDisabled?: boolean;
  isError?: boolean;
  onChange: (_: BN | undefined) => void;
  onEnter?: VoidFn;
  value?: BN | null;
}

const ZERO = new BN(0);

function InputGas ({ className, isDisabled, isError, onChange, onEnter, value = ZERO }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const isGasValid = !value?.isZero();

  return (
    <InputNumber
      bitLength={128}
      className={className}
      help={t('The maximum amount of gas that can be used by this deployment, if the code requires more, the deployment will fail.')}
      isDisabled={isDisabled}
      isError={isError || !isGasValid}
      label={t('maximum gas allowed')}
      onChange={onChange}
      onEnter={onEnter}
      value={value || undefined}
    />
  );
}

export default React.memo(InputGas);
