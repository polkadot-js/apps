// Copyright 2017-2022 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';

import { Button, Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  members: string[];
}

const MAX_REASON_LEN = 128;
const MIN_REASON_LEN = 5;

function TipCreate ({ members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [beneficiary, setBeneficiary] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [reason, setReason] = useState('');
  const [value, setValue] = useState<BN | undefined>();
  const hasValue = value?.gtn(0);
  const hasReason = reason?.length >= MIN_REASON_LEN && reason?.length <= MAX_REASON_LEN;

  useEffect((): void => {
    setIsMember(members.includes(accountId || ''));
  }, [accountId, members]);

  return (
    <>
      <Button
        icon='plus'
        label={t<string>('Propose tip')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          header={t<string>('Submit tip request')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('Use this account to request the tip from. This can be a normal or council account.')}>
              <InputAddress
                help={t<string>('Select the account you wish to submit the tip from.')}
                label={t<string>('submit with account')}
                onChange={setAccountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The beneficiary will received the tip as approved by council members.')}>
              <InputAddress
                help={t<string>('The account to which the tip will be transferred if approved')}
                label={t<string>('beneficiary')}
                onChange={setBeneficiary}
                type='allPlus'
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('A reason (to be stored-on-chain) as to why the recipient deserves a tip payout.')}>
              <Input
                autoFocus
                help={t<string>('The reason why this tip should be paid.')}
                isError={!hasReason}
                label={t<string>('tip reason')}
                onChange={setReason}
              />
            </Modal.Columns>
            {isMember && (
              <Modal.Columns hint={t<string>('As a council member, you can suggest an initial value for the tip, each other council member can suggest their own.')}>
                <InputBalance
                  help={t<string>('The suggested value for this tip')}
                  isError={!hasValue}
                  label={t<string>('tip value')}
                  onChange={setValue}
                />
              </Modal.Columns>
            )}
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId || (isMember && !hasValue) || !hasReason}
              label={t<string>('Propose tip')}
              onStart={toggleOpen}
              params={
                isMember
                  ? [reason, beneficiary, value]
                  : [reason, beneficiary]
              }
              tx={
                isMember
                  ? (api.tx.tips || api.tx.treasury).tipNew
                  : (api.tx.tips || api.tx.treasury).reportAwesome
              }
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(TipCreate);
