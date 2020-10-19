// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { InputNumber, Toggle } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  estimatedWeight?: BN | null;
  executionTime: number;
  help: React.ReactNode;
  isValid: boolean;
  megaGas: BN;
  percentage: number;
  setMegaGas: (value?: BN) => void;
}

function InputMegaGas ({ className, estimatedWeight, executionTime, help, isValid, megaGas, percentage, setMegaGas }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [withEstimate, setWithEstimate] = useState(false);

  const estimatedMg = useMemo(
    () => estimatedWeight
      ? estimatedWeight.divn(1e6).iaddn(1)
      : null,
    [estimatedWeight]
  );

  const label = useMemo(
    () => estimatedMg
      ? t<string>('max gas allowed (M, {{estimatedMg}} estimated)', { replace: { estimatedMg: estimatedMg.toString() } })
      : t<string>('max gas allowed (M)'),
    [estimatedMg, t]
  );

  useEffect((): void => {
    estimatedMg && withEstimate && setMegaGas(estimatedMg);
  }, [estimatedMg, setMegaGas, withEstimate]);

  const isDisabled = !!estimatedMg && withEstimate;

  return (
    <div className={className}>
      <InputNumber
        defaultValue={estimatedMg && isDisabled ? estimatedMg.toString() : undefined}
        help={help}
        isDisabled={isDisabled}
        isError={!isValid}
        label={label}
        onChange={isDisabled ? undefined : setMegaGas}
        value={isDisabled ? undefined : megaGas}
      >
        {estimatedWeight && (
          <Toggle
            isOverlay
            label={t<string>('use estimated gas')}
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
