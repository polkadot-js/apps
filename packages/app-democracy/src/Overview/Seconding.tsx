// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';

import translate from '../translate';

interface Props extends I18nProps {
  depositors: AccountId[];
  proposalId: BN | number;
}

function Seconding ({ depositors, proposalId, t }: Props): React.ReactElement<Props> | null {
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isSecondingOpen, setIsSecondingOpen] = useState(false);

  if (!hasAccounts) {
    return null;
  }

  const isDepositor = depositors.some((depositor): boolean => depositor.eq(accountId));
  const _toggleSeconding = (): void => setIsSecondingOpen(!isSecondingOpen);

  return (
    <>
      {isSecondingOpen && (
        <Modal
          header={t('Second proposal')}
          open
          size='small'
        >
          <Modal.Content>
            <InputAddress
              help={t('Select the account you wish to second with. This will lock your funds until the proposal is either approved or rejected')}
              label={t('second with account')}
              onChange={setAccountId}
              type='account'
              withLabel
            />
          </Modal.Content>
          <Modal.Actions>
            <Button.Group>
              <Button
                isNegative
                onClick={_toggleSeconding}
                label={t('Cancel')}
                icon='cancel'
              />
              <Button.Or />
              <TxButton
                accountId={accountId}
                isDisabled={!accountId || isDepositor}
                isPrimary
                label={t('Second')}
                icon='sign-in'
                onStart={_toggleSeconding}
                params={[proposalId]}
                tx='democracy.second'
              />
            </Button.Group>
          </Modal.Actions>
        </Modal>
      )}
      <Button
        isPrimary
        label={t('Second')}
        icon='toggle off'
        onClick={_toggleSeconding}
      />
    </>
  );
}

export default translate(Seconding);
