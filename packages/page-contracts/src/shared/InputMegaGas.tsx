// Copyright 2017-2023 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { UseWeight } from '../types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { InputNumber, styled, Toggle } from '@polkadot/react-components';
import { BN_MILLION, BN_ONE, BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  estimatedWeight?: BN | null;
  isCall?: boolean;
  weight: UseWeight;
}

function InputMegaGas ({ className, estimatedWeight, isCall, weight: { executionTime, isValid, megaGas, percentage, setIsEmpty, setMegaGas } }: Props): React.ReactElement<Props> {
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
    <StyledDiv className={className}>
      <InputNumber
        defaultValue={estimatedMg && isDisabled ? estimatedMg.toString() : undefined}
        isDisabled={isDisabled}
        isError={!isValid}
        isZeroable={isCall}
        label={
          estimatedMg && (isCall ? !withEstimate : true)
            ? t<string>('max gas allowed (M, {{estimatedMg}} estimated)', { replace: { estimatedMg: estimatedMg.toString() } })
            : t<string>('max gas allowed (M)')
        }
        labelExtra={(estimatedWeight || isCall) && (
          <Toggle
            label={
              isCall
                ? t<string>('max read gas')
                : t<string>('use estimated gas')
            }
            onChange={setWithEstimate}
            value={withEstimate}
          />
        )}
        onChange={isDisabled ? undefined : setMegaGas}
        value={isDisabled ? undefined : ((isCall && withEstimate) ? BN_ZERO : megaGas)}
      />
      <div className='contracts--InputMegaGas-meter'>
        {t<string>('{{executionTime}}s execution time', { replace: { executionTime: executionTime.toFixed(3) } })}{', '}
        {t<string>('{{percentage}}% of block weight', { replace: { percentage: percentage.toFixed(2) } })}
      </div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .contracts--InputMegaGas-meter {
    text-align: right;
  }
`;

export default React.memo(InputMegaGas);
