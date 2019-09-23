// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withMulti, withObservable } from '@polkadot/react-api';

import translate from '../translate';

interface Props extends I18nProps {
  allAccounts?: SubjectInfo;
  depositors: AccountId[];
  proposalId: BN | number;
}

function Seconding ({ allAccounts, depositors, proposalId, t }: Props): React.ReactElement<Props> | null {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isSecondingOpen, setIsSecondingOpen] = useState(false);
  const hasAccounts = allAccounts && Object.keys(allAccounts).length !== 0;

  if (!hasAccounts) {
    return null;
  }

  const isDepositor = depositors.some((depositor): boolean => depositor.eq(accountId));
  const _toggleSeconding = (): void => setIsSecondingOpen(!isSecondingOpen);

  return (
    <>
      {isSecondingOpen && (
        <Modal
          dimmer='inverted'
          open
          size='small'
        >
          <Modal.Header>{t('Second proposal')}</Modal.Header>
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
                labelIcon='cancel'
              />
              <Button.Or />
              <TxButton
                accountId={accountId}
                isDisabled={!accountId || isDepositor}
                isPrimary
                label={t('Second')}
                labelIcon='sign-in'
                onClick={_toggleSeconding}
                params={[proposalId]}
                tx='democracy.second'
              />
            </Button.Group>
          </Modal.Actions>
        </Modal>
      )}
      <div className='ui--Row-buttons'>
        <Button
          isPrimary
          label={t('Second proposal')}
          labelIcon='toggle off'
          onClick={_toggleSeconding}
        />
      </div>
    </>
  );
}

export default withMulti(
  Seconding,
  translate,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
