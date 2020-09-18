// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Button, Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  members: string[];
  refresh: () => void;
}

const MAX_REASON_LEN = 128;
const MIN_REASON_LEN = 5;

function TipCreate ({ members, refresh }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
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
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t<string>('Select the account you wish to submit the tip from.')}
                  label={t<string>('submit with account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Use this account to request the tip from. This can be a normal or council account.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t<string>('The account to which the tip will be transferred if approved')}
                  label={t<string>('beneficiary')}
                  onChange={setBeneficiary}
                  type='allPlus'
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The beneficiary will received the tip as approved by council members.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <Input
                  autoFocus
                  help={t<string>('The reason why this tip should be paid.')}
                  isError={!hasReason}
                  label={t<string>('tip reason')}
                  onChange={setReason}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('A reason (to be stored-on-chain) as to why the recipient deserves a tip payout.')}</p>
              </Modal.Column>
            </Modal.Columns>
            {isMember && (
              <Modal.Columns>
                <Modal.Column>
                  <InputBalance
                    help={t<string>('The suggested value for this tip')}
                    isError={!hasValue}
                    label={t<string>('tip value')}
                    onChange={setValue}
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('As a council member, you can suggest an initial value for the tip, each other council member can suggest their own.')}</p>
                </Modal.Column>
              </Modal.Columns>
            )}
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId || (isMember && !hasValue) || !hasReason}
              label={t<string>('Propose tip')}
              onStart={toggleOpen}
              onSuccess={refresh}
              params={
                isMember
                  ? [reason, beneficiary, value]
                  : [reason, beneficiary]
              }
              tx={
                isMember
                  ? 'treasury.tipNew'
                  : 'treasury.reportAwesome'
              }
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(TipCreate);
