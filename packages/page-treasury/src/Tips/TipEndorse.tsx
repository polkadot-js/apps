// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  defaultId: string | null;
  hash: string;
  isMember: boolean;
  isTipped: boolean;
  median: BN;
  members: string[];
}

function TipEndorse ({ defaultId, hash, isMember, isTipped, median, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(defaultId);
  const [value, setValue] = useState<BN | undefined>();

  return (
    <>
      <Button
        icon='check'
        isDisabled={!isMember}
        label={t<string>('Tip')}
        onClick={toggleOpen}
      />
      <TxButton
        accountId={defaultId}
        className='media--1600'
        icon='fighter-jet'
        isDisabled={!isMember || !isTipped}
        isIcon
        params={[hash, median]}
        tx='treasury.tip'
        withoutLink
      />
      {isOpen && (
        <Modal
          header={t<string>('Submit tip endorsement')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  filter={members}
                  help={t<string>('Select the account you wish to submit the tip from.')}
                  label={t<string>('submit with account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Your endorsement will be applied for this account.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputBalance
                  autoFocus
                  defaultValue={median}
                  help={t<string>('The tip amount that should be allocated')}
                  isZeroable
                  label={t<string>('value')}
                  onChange={setValue}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Allocate a suggested tip amount. With enough endorsements, the suggested values are averaged and sent to the beneficiary.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId}
              label={t<string>('Submit tip')}
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
