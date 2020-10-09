// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ThemeProps } from '@polkadot/react-components/types';

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
  megaGas: BN;
  percentage: number;
  setMegaGas: (value?: BN) => void;
}

function InputMegaGas ({ className, executionTime, help, isValid, label, megaGas, percentage, setMegaGas }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <InputNumber
        className='contracts--InputMegaGas-input'
        help={help}
        isError={!isValid}
        label={label}
        onChange={setMegaGas}
        value={megaGas}
      >
        <div className='contracts--InputMegaGas-meter'>
          <div>{t<string>('{{executionTime}}s execution time', { replace: { executionTime: executionTime.toFixed(3) } })}</div>
          <div>{t<string>('{{percentage}}% of block time', { replace: { percentage } })}</div>
        </div>
      </InputNumber>
    </div>
  );
}

export default React.memo(styled(InputMegaGas)(({ theme }: ThemeProps) => `
  .contracts--InputMegaGas-input {
    .ui.input {
      display: flex;

      .contracts--InputMegaGas-meter {
        color: ${theme.color};
        flex: 1;
        padding: 0.8rem 0.8rem 0;
      }
    }
  }
`));
