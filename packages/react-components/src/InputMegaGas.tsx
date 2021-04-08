// Copyright 2017-2021 @polkadot/app-execute authors & contributors
// and @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from './types';
import { UseWeight } from '@canvas-ui/react-hooks/types';
import { classes } from '@canvas-ui/react-util';
import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { BN_ZERO } from '@polkadot/util';

import InputNumber from './InputNumber';
import Progress from './Progress';
import Toggle from './Toggle';
import { useTranslation } from './translate';

interface Props extends BareProps {
  estimatedWeight?: BN;
  help: React.ReactNode;
  isCall?: boolean;
  label: React.ReactNode;
  weight: UseWeight;
}

const MEGA = new BN(1_000_000);

function InputMegaGas ({ className, estimatedWeight, help, isCall, weight: { executionTime, isValid, megaGas, percentage, setIsEmpty, setMegaGas } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const [withEstimate, setWithEstimate] = useState(true);

  const estimatedMg = useMemo(
    () => estimatedWeight
      ? estimatedWeight.div(MEGA).iaddn(1)
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
    <div className={classes(className, isCall ? 'isCall' : 'isInstantiate')}>
      <InputNumber
        defaultValue={estimatedMg && isDisabled ? estimatedMg.toString() : undefined}
        help={help}
        isDisabled={isDisabled}
        isError={!isValid}
        isZeroable={isCall}
        label={t<string>('Max Gas Allowed (M)')}
        onChange={isDisabled ? undefined : setMegaGas}
        value={isDisabled ? undefined : ((isCall && withEstimate) ? BN_ZERO : megaGas)}
      >
        {(estimatedWeight || isCall) && (
          <Toggle
            isOverlay
            label={
              isCall
                ? t<string>(withEstimate ? 'use estimated gas' : 'specify gas')
                : t<string>('use estimated gas')
            }
            onChange={setWithEstimate}
            value={withEstimate}
          />
        )}
      </InputNumber>
      <div className='contracts--InputMegaGas-meter'>
        {t<string>('{{executionTime}}s execution time', { replace: { executionTime: executionTime < 0.001 ? '<0.001' : executionTime.toFixed(3) } })}
        <aside>
          {t<string>('{{percentage}}% of block time', { replace: { percentage: percentage.toFixed(3) } })}
        </aside>
        <Progress
          className='contracts--InputMegaGas-progress'
          color={percentage < 100 ? 'green' : 'red'}
          total={100}
          value={percentage}
        />
      </div>
    </div>
  );
}

export default React.memo(
  styled(InputMegaGas)`
    .ui.input {
      display: flex;
    }

    &.isInstantiate {
      .ui.input {
        flex-grow: 1;
        margin-right: 0;
      }
    }

    &.isCall {
      .ui.input {
        width: 18rem;
        margin-right: 1rem;
        flex-grow: 0;
      }
    }
    
    .contracts--InputMegaGas-meter {
      flex: 1;
      margin: 1rem 0;

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
