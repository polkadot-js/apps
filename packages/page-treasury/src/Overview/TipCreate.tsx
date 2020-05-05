// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
    setIsMember(
      accountId
        ? members.includes(accountId)
        : false
    );
  }, [accountId, members]);

  return (
    <>
      <Button
        icon='plus'
        label={t('Tip')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          header={t('Submit tip request')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t('Select the account you wish to submit the tip from.')}
                  label={t('submit with account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t('Use this account to request the tip from. This can be a normal or council account.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t('The account to which the tip will be transferred if approved')}
                  label={t('beneficiary')}
                  onChange={setBeneficiary}
                  type='allPlus'
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t('The beneficiary will received the tip as approved by council members.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <Input
                  autoFocus
                  help={t('The reason why this tip should be paid.')}
                  isError={!hasReason}
                  label={t('tip reason')}
                  onChange={setReason}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t('A reason (to be stored-on-chain) as to why the recipient deserves a tip payout.')}</p>
              </Modal.Column>
            </Modal.Columns>
            {isMember && (
              <Modal.Columns>
                <Modal.Column>
                  <InputBalance
                    help={t('The suggested value for this tip')}
                    isError={!hasValue}
                    label={t('tip value')}
                    onChange={setValue}
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t('As a council member, you can suggest an initial value for the tip, each other council member can suggest their own.')}</p>
                </Modal.Column>
              </Modal.Columns>
            )}
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='add'
              isDisabled={!accountId || (isMember ? !hasValue : false) || !hasReason}
              isPrimary
              label={t('Propose tip')}
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
