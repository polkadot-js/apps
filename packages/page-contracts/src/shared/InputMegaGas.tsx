// Copyright 2017-2021 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { UseWeight } from '../types';

import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { InputNumber, Toggle } from '@polkadot/react-components';
import { BN_MILLION, BN_ONE, BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  estimatedWeight?: BN;
  help: React.ReactNode;
  isCall?: boolean;
  weight: UseWeight;
}

function InputMegaGas ({ className, estimatedWeight, help, isCall, weight: { executionTime, isValid, megaGas, percentage, setIsEmpty, setMegaGas } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [withEstimate, setWithEstimate] = useState(true);

  const estimatedMg = useMemo(
    () => estimatedWeight
      ? estimatedWeight.div(BN_MILLION).iadd(BN_ONE)
      : null,
    [estimatedWeight]
  );

  useEffect((): void => {
    withEstimate && estimatedMg && setMegaGas(estimatedMg);
  }, [estimatedMg, setMegaGas, withEstimate]);

  useEffect((): void => {
    setIsEmpty(withEstimate && !!isCall);
  }, [isCall, setIsEmpty, withEstimate]);

  const isDisabled = !!estimatedMg && withEstimate;

  return (
    <div className={className}>
      <InputNumber
        defaultValue={estimatedMg && isDisabled ? estimatedMg.toString() : undefined}
        help={help}
        isDisabled={isDisabled}
        isError={!isValid}
        isZeroable={isCall}
        label={
          estimatedMg && (isCall ? !withEstimate : true)
            ? t<string>('max gas allowed (M, {{estimatedMg}} estimated)', { replace: { estimatedMg: estimatedMg.toString() } })
            : t<string>('max gas allowed (M)')
        }
        onChange={isDisabled ? undefined : setMegaGas}
        value={isDisabled ? undefined : ((isCall && withEstimate) ? BN_ZERO : megaGas)}
      >
        {(estimatedWeight || isCall) && (
          <Toggle
            isOverlay
            label={
              isCall
                ? t<string>('max read gas')
                : t<string>('use estimated gas')
            }
            onChange={setWithEstimate}
            value={withEstimate}
          />
        )}
      </InputNumber>
      <div className='contracts--InputMegaGas-meter'>
        {t<string>('{{executionTime}}s execution time', { replace: { executionTime: executionTime.toFixed(3) } })}{', '}
        {t<string>('{{percentage}}% of block weight', { replace: { percentage: percentage.toFixed(2) } })}
      </div>
    </div>
  );
}

export default React.memo(styled(InputMegaGas)`
  .contracts--InputMegaGas-meter {
    text-align: right;
  }
`);
