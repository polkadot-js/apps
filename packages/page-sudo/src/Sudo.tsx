// Copyright 2017-2020 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';

import BN from 'bn.js';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { Button, Icon, Extrinsic, Toggle, TxButton, InputNumber } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

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
    (method: SubmittableExtrinsic<'promise'> | null = null) =>
      setMethod(() => method),
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
        <br />
        {withWeight && (
          <InputNumber
            help={t<string>('The unchecked weight as specified for the sudoUncheckedWeight call.')}
            isError={weight.eq(BN_ZERO)}
            isZeroable={false}
            label={t<string>('unchecked weight for this call')}
            onChange={_onChangeWeight}
            value={weight}
          />
        )}
        {api.tx.sudo.sudoUncheckedWeight && (
          <Toggle
            className='sudoToggle'
            label={
              withWeight
                ? t<string>('sudo with unchecked weight parameter')
                : t<string>('sudo without unchecked weight parameter')
            }
            onChange={toggleWithWeight}
            value={withWeight}
          />
        )}
        <Button.Group>
          <TxButton
            accountId={sudoKey}
            icon='sign-in-alt'
            isDisabled={!method || (withWeight ? weight.eq(BN_ZERO) : false)}
            label={t<string>('Submit Sudo')}
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
