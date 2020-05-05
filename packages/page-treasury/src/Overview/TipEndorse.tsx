// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  hash: string;
  isMember: boolean;
  members: string[];
}

function TipEndorse ({ hash, isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [value, setValue] = useState<BN | undefined>();
  const hasValue = value?.gtn(0);

  return (
    <>
      <Button
        icon='check'
        isDisabled={!isMember}
        label={t('Endorse')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          header={t('Submit tip endorsement')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  filter={members}
                  help={t('Select the account you wish to submit the tip from.')}
                  label={t('submit with account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t('Your endorsement will be applied for this account.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputBalance
                  help={t('The tip amount that should be allocated')}
                  isError={!hasValue}
                  label={t('value')}
                  onChange={setValue}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t('Allocate a suggested tip amount. With enough endorsements, the suggested values are averaged and sent to the beneficiary.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='add'
              isDisabled={!accountId || !hasValue }
              isPrimary
              label={t('Submit tip')}
              onStart={toggleOpen}
              params={[hash, value]}
              tx='treasury.tip'
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(TipEndorse);
