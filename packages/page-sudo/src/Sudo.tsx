// Copyright 2017-2020 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ComponentProps as Props } from './types';

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Button, Icon, Extrinsic, Toggle, TxButton, InputNumber } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from './translate';

const ZERO = new BN(0);

function Propose ({ className, isMine, sudoKey }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, apiDefaultTxSudo } = useApi();
  const [withWeight, toggleWithWeight] = useToggle();
  const [method, setMethod] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [weight, setWeight] = useState<BN>(ZERO);

  const _onChangeExtrinsic = useCallback(
    (method: SubmittableExtrinsic<'promise'> | null = null) =>
      setMethod(() => method),
    []
  );

  const _onChangeWeight = useCallback(
    (weight: BN = ZERO) => setWeight(weight),
    []
  );

  return isMine
    ? (
      <section className={className}>
        <Extrinsic
          defaultValue={apiDefaultTxSudo}
          label={t('submit the following change')}
          onChange={_onChangeExtrinsic}
        />
        <br />
        {withWeight && (
          <InputNumber
            help={t('The unchecked weight as specified for the sudoUncheckedWeight call.')}
            isError={weight.eq(ZERO)}
            isZeroable={false}
            label={t('unchecked weight for this call')}
            onChange={_onChangeWeight}
            value={weight}
          />
        )}
        {api.tx.sudo.sudoUncheckedWeight && (
          <Toggle
            className='sudoToggle'
            label={
              withWeight
                ? t('sudo with unchecked weight parameter')
                : t('sudo without unchecked weight parameter')
            }
            onChange={toggleWithWeight}
            value={withWeight}
          />
        )}
        <Button.Group>
          <TxButton
            accountId={sudoKey}
            icon='sign-in'
            isDisabled={!method || (withWeight ? weight.eq(ZERO) : false)}
            label={t('Submit Sudo')}
            params={
              withWeight
                ? [method, weight]
                : [method]
            }
            tx={
              withWeight
                ? 'sudo.sudoUncheckedWeight'
                : 'sudo.sudo'
            }
          />
        </Button.Group>
      </section>
    )
    : (
      <article className='error padded'>
        <div>
          <Icon name='ban' />
          {t('You do not have access to the current sudo key')}
        </div>
      </article>
    );
}

export default React.memo(styled(Propose)`
  .sudoToggle {
    width: 100%;
    text-align: right;
  }
`);
