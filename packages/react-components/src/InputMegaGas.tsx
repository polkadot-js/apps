// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@canvas-ui/react-components/types';
import { UseWeight } from '@canvas-ui/react-hooks/types';

import React from 'react';
import styled from 'styled-components';

import InputNumber from './InputNumber';
import Progress from './Progress';
import { useTranslation } from './translate';

interface Props extends BareProps, UseWeight {
  help: React.ReactNode;
  label: React.ReactNode;
}

function InputMegaGas ({ className, executionTime, help, isValid, label, megaGas, percentage, setMegaGas }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <InputNumber
      className={className}
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
          color={percentage < 100 ? 'green' : 'red'}
          total={100}
          value={percentage}
        />
      </div>
    </InputNumber>
  );
}

export default React.memo(
  styled(InputMegaGas)`
    .ui.input {
      display: flex;
      flex-grow: 0;
      width: 12rem;
    }
    
    .contracts--InputMegaGas-meter {
      flex: 1;
      padding: 0 0.75rem;

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
  `
);
