// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { TxSource, TxDef } from '@polkadot/react-hooks/types';
import { Call } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Extrinsic, InputNumber, TxModalNew as TxModal } from '@polkadot/react-components';
import { useApi, useTx } from '@polkadot/react-hooks';
import { createType } from '@polkadot/types';

import translate from '../translate';

interface Props extends I18nProps {
  isOpen: boolean;
  memberCount: number;
  onClose: () => void;
}

function Propose ({ t, isOpen, onClose, memberCount = 0 }: Props): React.ReactElement<Props> {
  const _hasThreshold = (threshold?: BN | null): boolean => {
    return !!threshold && !threshold.isZero() && threshold.lten(memberCount);
  };

  const [method, setMethod] = useState<Call | null>(null);
  const [[threshold, hasThreshold], setThreshold] = useState<[BN | null, boolean]>([
    new BN(memberCount / 2 + 1),
    true
  ]);

  const _onChangeThreshold = (threshold?: BN): void => {
    setThreshold([threshold || null, _hasThreshold(threshold)]);
  };

  const _onChangeExtrinsic = (method?: Call): void => {
    !!method && setMethod(method);
  };

  useEffect(
    (): void => setThreshold([threshold, _hasThreshold(threshold)]),
    [memberCount]
  );

  const { apiDefaultTxSudo } = useApi();
  const txState = useTx(
    (): TxSource<TxDef> => [
      [
        'technicalCommittee.propose',
        [threshold, method ? createType(registry, 'Proposal', method) : null]
      ],
      !!method && hasThreshold
    ],
    [memberCount, method, threshold, hasThreshold],
    {
      onSuccess: onClose
    }
  );

  return (
    <TxModal
      isOpen={isOpen}
      onClose={onClose}
      {...txState}
      header={t('Propose a committee motion')}
      content={
        <>
          <InputNumber
            className='medium'
            label={t('threshold')}
            help={t('The minimum number of committee votes required to approve this motion')}
            isError={!hasThreshold}
            onChange={_onChangeThreshold}
            onEnter={txState.sendTx}
            placeholder={
              t(
                'Positive number between 1 and {{memberCount}}',
                { replace: { memberCount } }
              )
            }
            value={threshold || undefined}
          />
          <Extrinsic
            defaultValue={apiDefaultTxSudo}
            label={t('proposal')}
            onChange={_onChangeExtrinsic}
            onEnter={txState.sendTx}
          />
        </>
      }
    />
  );
}

export default translate(Propose);
