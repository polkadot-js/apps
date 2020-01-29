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

const ZERO = new BN(0);

export default function Propose ({ collective, isMember = false, members = [], prompt, thresholdHelp }: Props): React.ReactElement<Props> {
  const _hasThreshold = (threshold: BN = ZERO): [BN, boolean] =>
    [threshold, threshold.gtn(0) && threshold.lten(members.length)];

  const { apiDefaultTxSudo } = useApi();
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useModal();
  const [accountId, onChangeAccountId] = useAccountId();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [[threshold, hasThreshold], setThreshold] = useState<[BN, boolean]>([new BN(Math.ceil(members.length * 0.5)), true]);
  const onSendRef = useRef<() => void>();

  useEffect((): void => {
    setThreshold(_hasThreshold(threshold));
  }, [members]);

  const _onChangeExtrinsic = (method?: Call): void =>
    setProposal(method ? createType(registry, 'Proposal', method) : null);
  const _onChangeThreshold = (threshold?: BN): void =>
    setThreshold(_hasThreshold(threshold));

  return (
    <>
      <Button
        isDisabled={!isMember}
        isPrimary
        label={prompt}
        icon='add'
        onClick={onOpen}
      />
      {isOpen && (
        <Modal
          header={prompt}
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
              value={threshold}
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
              onStart={onClose}
              onSendRef={onSendRef}
              params={[threshold, proposal]}
              tx={`${collective}.propose`}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}
