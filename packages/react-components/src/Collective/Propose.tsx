// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TxModalProps } from '@polkadot/react-components/types';
import { TxSource } from '@polkadot/react-hooks/types';
import { Call, Proposal } from '@polkadot/types/interfaces';
import { CollectiveProps } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Button, Extrinsic, InputNumber, TxModalNew as TxModal } from '@polkadot/react-components';
import { useApi, useTxModal } from '@polkadot/react-hooks';
import { createType } from '@polkadot/types';

import { useTranslation } from '../translate';

interface Props extends CollectiveProps {
  memberCount: number;
  txModalProps?: Pick<TxModalProps, never>;
}

export default function Propose ({ collective, isMember = false, memberCount = 0, txModalProps = {} }: Props): React.ReactElement<Props> {
  const _hasThreshold = (threshold?: BN | null): boolean =>
    !!threshold && !threshold.isZero() && threshold.lten(memberCount);

  const { api, apiDefaultTxSudo } = useApi();
  const { t } = useTranslation();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [[threshold, hasThreshold], setThreshold] = useState<[BN | null, boolean]>([
    new BN(memberCount / 2 + 1),
    true
  ]);

  const txModalState = useTxModal(
    (): TxSource => ({
      tx: ((): Call | null => {
        try {
          return api.tx[collective].propose(threshold, proposal);
        } catch (e) {
          return null;
        }
      })(),
      isSubmittable: !!proposal && hasThreshold
    }),
    [memberCount, proposal, threshold, hasThreshold]
  );

  useEffect((): void => {
    setThreshold([threshold, _hasThreshold(threshold)]);
  }, [memberCount]);

  const _onChangeExtrinsic = (method?: Call): void =>
    setProposal(method ? createType(registry, 'Proposal', method) : null);
  const _onChangeThreshold = (threshold?: BN): void =>
    setThreshold([threshold || null, _hasThreshold(threshold)]);

  let title: React.ReactNode;
  let help: React.ReactNode;
  switch (collective) {
    case 'technicalCommittee':
      title = t('Submit a technical committee proposal');
      help = t('The minimum number of committee votes required to approve this proposal.');
      break;
    case 'council':
    default:
      title = t('Submit a council motion');
      help = t('The minimum number of council votes required to approve this motion.');
      break;
  }

  return (
    <TxModal
      {...txModalState}
      header={title}
      trigger={
        ({ onOpen }): React.ReactElement => ((
          <Button
            isDisabled={!isMember}
            isPrimary
            label={title}
            icon='add'
            onClick={onOpen}
          />
        ))
      }
      {...txModalProps}
    >
      <InputNumber
        className='medium'
        label={t('threshold')}
        help={help}
        isError={!hasThreshold}
        onChange={_onChangeThreshold}
        onEnter={txModalState.sendTx}
        onEscape={txModalState.onClose}
        placeholder={t('Positive number between 1 and {{memberCount}}', { replace: { memberCount } })}
        value={threshold || undefined}
      />
      <Extrinsic
        defaultValue={apiDefaultTxSudo}
        label={t('proposal')}
        onChange={_onChangeExtrinsic}
        onEnter={txModalState.sendTx}
        onEscape={txModalState.onClose}
      />
    </TxModal>
  );
}
