// Copyright 2017-2021 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { SubmittableExtrinsic } from '@polkadot/api/types';

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { Button, Extrinsic, Icon, InputNumber, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  isMine: boolean;
  sudoKey?: string;
}

function Sudo ({ className, isMine, sudoKey }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, apiDefaultTxSudo } = useApi();
  const [withWeight, toggleWithWeight] = useToggle();
  const [method, setMethod] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [weight, setWeight] = useState<BN>(BN_ZERO);

  const _onChangeExtrinsic = useCallback(
    (method: SubmittableExtrinsic<'promise'> | null = null) => setMethod(() => method),
    []
  );

  const _onChangeWeight = useCallback(
    (weight: BN = BN_ZERO) => setWeight(weight),
    []
  );

  return isMine
    ? (
      <section className={className}>
        <Extrinsic
          defaultValue={apiDefaultTxSudo}
          label={t<string>('submit the following change')}
          onChange={_onChangeExtrinsic}
        />
        {isFunction(api.tx.sudo.sudoUncheckedWeight) && (
          <InputNumber
            help={t<string>('The unchecked weight as specified for the sudoUncheckedWeight call.')}
            isDisabled={!withWeight}
            isError={weight.eq(BN_ZERO)}
            isZeroable={false}
            label={t<string>('unchecked weight for this call')}
            onChange={_onChangeWeight}
            value={weight}
          >
            <Toggle
              className='sudoToggle'
              isOverlay
              label={t<string>('with weight override')}
              onChange={toggleWithWeight}
              value={withWeight}
            />
          </InputNumber>
        )}
        <Button.Group>
          <TxButton
            accountId={sudoKey}
            icon='sign-in-alt'
            isDisabled={!method || (withWeight ? weight.eq(BN_ZERO) : false)}
            label={
              withWeight
                ? t<string>('Submit Sudo Unchecked')
                : t<string>('Submit Sudo')
            }
            params={
              withWeight
                ? [method, weight]
                : [method]
            }
            tx={
              withWeight
                ? api.tx.sudo.sudoUncheckedWeight
                : api.tx.sudo.sudo
            }
          />
        </Button.Group>
      </section>
    )
    : (
      <article className='error padded'>
        <div>
          <Icon icon='ban' />
          {t<string>('You do not have access to the current sudo key')}
        </div>
      </article>
    );
}

export default React.memo(styled(Sudo)`
  .sudoToggle {
    width: 100%;
    text-align: right;
  }
`);
