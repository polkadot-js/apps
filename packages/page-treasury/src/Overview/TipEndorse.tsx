// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  hash: string;
  isMember: boolean;
  isTipped: boolean;
  median: BN;
  members: string[];
}

function TipEndorse ({ hash, isMember, isTipped, median, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isOpen, toggleOpen] = useToggle();
  const { allAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [defaultId, setDefaultId] = useState<string | null>(null);
  const [value, setValue] = useState<BN | undefined>();

  useEffect((): void => {
    setDefaultId(
      members.find((memberId) => allAccounts.includes(memberId)) || null
    );
  }, [allAccounts, members]);

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
        className='ui--media-1600'
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
