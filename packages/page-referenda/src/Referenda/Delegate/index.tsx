// Copyright 2017-2023 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferenda, PalletVote, TrackDescription } from '../../types';

import React, { useState } from 'react';

import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';
import useActivityFellows from './useActivityFellows';
import useActivityNominators from './useActivityNominators';

interface Props {
  className?: string;
  palletReferenda: PalletReferenda;
  palletVote: PalletVote;
  tracks?: TrackDescription[];
}

function Delegate ({ className, palletVote }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);

  // anything that is supplied by the user
  // useActivityAccount(palletVote, selectedAccount)

  // get all activity for our nominees
  useActivityNominators(palletVote, accountId);

  // we also need the activity for all fellows
  useActivityFellows(palletVote);

  return (
    <>
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Delegate votes')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('Delegate from this account to another. All votes made on the target would count as a delegated vote for this account.')}>
              <InputAddress
                label={t<string>('delegate from account')}
                onChange={setAccountId}
                type='account'
                withLabel
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='code-merge'
              label={t<string>('Delegate')}
              onStart={toggleOpen}
              params={[0, false]}
              tx={api.tx[palletVote].delegate}
            />
          </Modal.Actions>
        </Modal>
      )}
      <Button
        icon='code-merge'
        label={t<string>('Delegate')}
        onClick={toggleOpen}
      />
    </>
  );
}

export default React.memo(Delegate);
