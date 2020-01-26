// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Call, Proposal } from '@polkadot/types/interfaces';
import { CollectiveProps } from './types';

import BN from 'bn.js';
import React, { useEffect, useRef, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { Button, Extrinsic, InputNumber, Modal, TxAccount, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useModal } from '@polkadot/react-hooks';
import { createType } from '@polkadot/types';

import { useTranslation } from '../translate';

interface Props extends CollectiveProps {
  prompt: React.ReactNode;
  thresholdHelp: React.ReactNode;
}

export default function Propose ({ collective, isMember = false, members = [], prompt, thresholdHelp }: Props): React.ReactElement<Props> {
  const _hasThreshold = (threshold?: BN | null): boolean =>
    !!threshold && !threshold.isZero() && threshold.lten(members.length);

  const { apiDefaultTxSudo } = useApi();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useModal();
  const [accountId, onChangeAccountId] = useAccountId();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [[threshold, hasThreshold], setThreshold] = useState<[BN | null, boolean]>([
    new BN(members.length / 2 + 1),
    true
  ]);

  const onSendRef = useRef<() => void>();

  // const { isOpen, isSubmittable, onChangeAccountId, onClose, onOpen, sendTx } = useTxModal(
  //   (): TxSource => ({
  //     tx: ((): Call | null => {
  //       try {
  //         return api.tx[collective].propose(threshold, proposal);
  //       } catch (e) {
  //         return null;
  //       }
  //     })(),
  //     isSubmittable: !!proposal && hasThreshold
  //   }),
  //   [members, proposal, threshold, hasThreshold]
  // );

  useEffect((): void => {
    setThreshold([threshold, _hasThreshold(threshold)]);
  }, [members]);

  const _onChangeExtrinsic = (method?: Call): void =>
    setProposal(method ? createType(registry, 'Proposal', method) : null);
  const _onChangeThreshold = (threshold?: BN): void =>
    setThreshold([threshold || null, _hasThreshold(threshold)]);

  // let title: React.ReactNode;
  // let help: React.ReactNode;
  // switch (collective) {
  //   case 'technicalCommittee':
  //     title = t('Submit a technical committee proposal');
  //     help = t('The minimum number of committee votes required to approve this proposal.');
  //     break;
  //   case 'council':
  //   default:
  //     title = t('Submit a council motion');
  //     help = t('The minimum number of council votes required to approve this motion.');
  //     break;
  // }

  return (
    <>
      <Button
        isDisabled={!isMember}
        isPrimary
        label={prompt}
        icon='add'
        onClick={onOpen}
      />
      <Modal
        header={prompt}
        open={isOpen}
        onClose={onClose}
        small
      >
        <Modal.Content>
          <TxAccount
            filter={members}
            onChange={onChangeAccountId}
          />
          <InputNumber
            className='medium'
            label={t('threshold')}
            help={thresholdHelp}
            isError={!hasThreshold}
            onChange={_onChangeThreshold}
            onEnter={onSendRef.current}
            onEscape={onClose}
            placeholder={t('Positive number between 1 and {{memberCount}}', { replace: { memberCount: members.length } })}
            value={threshold || undefined}
          />
          <Extrinsic
            defaultValue={apiDefaultTxSudo}
            label={t('proposal')}
            onChange={_onChangeExtrinsic}
            onEnter={onSendRef.current}
            onEscape={onClose}
          />
        </Modal.Content>
        <Modal.Actions onCancel={onClose}>
          <TxButton
            accountId={accountId}
            isDisabled={!proposal || !hasThreshold}
            onClick={onClose}
            onSendRef={onSendRef}
            params={[threshold, proposal]}
            tx={`${collective}.propose`}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}
