// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { TxSource, TxDef } from '@polkadot/react-hooks/types';
import { Call, Proposal } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Extrinsic, InputNumber, TxModalNew as TxModal } from '@polkadot/react-components';
import { useApi, useTx } from '@polkadot/react-hooks';
import { createType } from '@polkadot/types';

import translate from '../translate';

interface Props extends I18nProps {
  memberCount?: number;
  onClose: () => void;
}

function Propose ({ t, onClose, memberCount = 0 }: Props): React.ReactElement<Props> {
  const _hasThreshold = (threshold?: BN | null): boolean =>
    !!threshold && !threshold.isZero() && threshold.lten(memberCount);

  const { apiDefaultTxSudo } = useApi();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [[threshold, hasThreshold], setThreshold] = useState<[BN | null, boolean]>([
    new BN(memberCount / 2 + 1),
    true
  ]);

  // FIXME Rework this, unless you know, you can never figure out what all these options mean here
  const txState = useTx(
    (): TxSource<TxDef> => [
      [
        'technicalCommittee.propose',
        [threshold, proposal]
      ],
      !!proposal && hasThreshold
    ],
    [memberCount, proposal, threshold, hasThreshold],
    {}
  );

  useEffect((): void => {
    setThreshold([threshold, _hasThreshold(threshold)]);
  }, [memberCount]);

  const _onChangeExtrinsic = (method?: Call): void =>
    setProposal(method ? createType(registry, 'Proposal', method) : null);
  const _onChangeThreshold = (threshold?: BN): void =>
    setThreshold([threshold || null, _hasThreshold(threshold)]);

  return (
    <TxModal
      isOpen
      onClose={onClose}
      {...txState}
      header={t('Propose a committee motion')}
    >
      <InputNumber
        className='medium'
        label={t('threshold')}
        help={t('The minimum number of committee votes required to approve this motion')}
        isError={!hasThreshold}
        onChange={_onChangeThreshold}
        onEnter={txState.sendTx}
        placeholder={t('Positive number between 1 and {{memberCount}}', { replace: { memberCount } })}
        value={threshold || undefined}
      />
      <Extrinsic
        defaultValue={apiDefaultTxSudo}
        label={t('proposal')}
        onChange={_onChangeExtrinsic}
        onEnter={txState.sendTx}
      />
    </TxModal>
  );
}

export default translate(Propose);
