// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { InputNumber, Progress } from '@polkadot/react-components';

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
          {t<string>('{{executionTime}}s execution time', { replace: { executionTime: executionTime.toFixed(3) } })}
          <aside>
            {t<string>('{{percentage}}% of block time', { replace: { percentage } })}
          </aside>
          <Progress
            className='contracts--InputMegaGas-progress'
            total={100}
            value={percentage}
          />
        </div>
      </InputNumber>
    </div>
  );
}

export default React.memo(
  styled(InputMegaGas)`
    .contracts--InputMegaGas-input {

      .ui.input {
        display: flex;

        input {
          max-width: 15rem;
        }

        .contracts--InputMegaGas-meter {
          flex: 1;
          padding: 0.8rem 0.8rem 0;

          aside {
            float: right;
          }

          .contracts--InputMegaGas-progress {
            margin-top: 0.4rem;
            position: relative;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }

      }
    }

  `
);
