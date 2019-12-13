// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps, TxModalProps } from '@polkadot/react-components/types';
import { TxSource, TxDef } from '@polkadot/react-hooks/types';
import { Call, Proposal } from '@polkadot/types/interfaces';
import { CollectiveProps } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Button, Extrinsic, InputNumber, TxModalNew as TxModal } from '@polkadot/react-components';
import { useApi, useTxModal } from '@polkadot/react-hooks';
import { createType } from '@polkadot/types';

import translate from '../translate';

interface Props extends CollectiveProps, I18nProps {
  txModalProps?: Pick<TxModalProps, never>;
}

function Propose ({ t, collective, memberCount = 0, txModalProps = {} }: Props): React.ReactElement<Props> {
  const _hasThreshold = (threshold?: BN | null): boolean =>
    !!threshold && !threshold.isZero() && threshold.lten(memberCount);

  const { apiDefaultTxSudo } = useApi();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [[threshold, hasThreshold], setThreshold] = useState<[BN | null, boolean]>([
    new BN(memberCount / 2 + 1),
    true
  ]);

  // FIXME Rework this, unless you know, you can never figure out what all these options mean here
  const txModalState = useTxModal(
    (): TxSource<TxDef> => [
      [
        `${collective}.propose`,
        [threshold, proposal]
      ],
      !!proposal && hasThreshold
    ],
    [memberCount, proposal, threshold, hasThreshold],
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
      help = t('The minimum number of committee votes required to approve this proposal.')
      break;
    case 'council':
    default:
      title = t('Submit a council motion');
      help = t('The minimum number of council votes required to approve this motion.')
      break;
  }

  return (
    <TxModal
      {...txModalState}
      header={title}
      trigger={
        ({ onOpen }): React.ReactElement => ((
          <Button
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

export default translate(Propose);