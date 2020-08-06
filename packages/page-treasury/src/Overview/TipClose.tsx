// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  hash: string;
  isMember: boolean;
  members: string[];
}

function TipClose ({ hash, isMember, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);

  return (
    <>
      <Button
        icon='times'
        isDisabled={!isMember}
        label={t<string>('Close')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          header={t<string>('Close tip')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  filter={members}
                  help={t<string>('Select the account you wish to close from.')}
                  label={t<string>('submit with account')}
                  onChange={setAccountId}
                  type='account'
                  withLabel
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Your close will be applied for this council account.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              isDisabled={!accountId}
              onStart={toggleOpen}
              params={[hash]}
              tx='treasury.closeTip'
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(TipClose);
