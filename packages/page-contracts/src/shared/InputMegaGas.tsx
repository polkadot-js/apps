// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { InputNumber } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  executionTime: number;
  help: React.ReactNode;
  isValid: boolean;
  label: React.ReactNode;
  labelExtra?: React.ReactNode;
  megaGas: BN;
  percentage: number;
  setMegaGas: (value?: BN) => void;
}

function InputMegaGas ({ className, executionTime, help, isValid, label, labelExtra, megaGas, percentage, setMegaGas }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <InputNumber
        help={help}
        isError={!isValid}
        label={label}
        labelExtra={labelExtra}
        onChange={setMegaGas}
        value={megaGas}
      />
      <div className='contracts--InputMegaGas-meter'>
        {t<string>('{{executionTime}}s execution time', { replace: { executionTime: executionTime.toFixed(3) } })}{', '}
        {t<string>('{{percentage}}% of block weight', { replace: { percentage } })}
      </div>
    </div>
  );
}

export default React.memo(styled(InputMegaGas)`
  .contracts--InputMegaGas-meter {
    text-align: right;
  }
`);
