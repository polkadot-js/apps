// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StakerState } from '@polkadot/react-hooks/types';

import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { AddressMini, Button, InputAddress, Modal, Static, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isDisabled: boolean;
  ownNominators?: StakerState[];
  targets: string[];
}

interface IdState {
  controllerId?: string | null;
  stashId: string;
}

function Nominate ({ className = '', isDisabled, ownNominators, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [ids, setIds] = useState<IdState | null>(null);
  const [isOpen, toggleOpen] = useToggle();

  const stashes = useMemo(
    () => (ownNominators || []).map(({ stashId }) => stashId),
    [ownNominators]
  );

  const _onChangeStash = useCallback(
    (accountId?: string | null): void => {
      const acc = ownNominators && ownNominators.find(({ stashId }) => stashId === accountId);

      setIds(
        acc
          ? { controllerId: acc.controllerId, stashId: acc.stashId }
          : null
      );
    },
    [ownNominators]
  );

  return (
    <>
      <Button
        icon='hand-paper'
        isDisabled={isDisabled || !stashes.length || !targets.length}
        label={t<string>('Nominate selected')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Nominate validators')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('One of your available nomination accounts, keyed by the stash. The transaction will be sent from the controller.')}>
              <InputAddress
                filter={stashes}
                help={t<string>('Your stash account. The transaction will be sent from the associated controller.')}
                label={t<string>('the stash account to nominate with')}
                onChange={_onChangeStash}
                value={ids?.stashId}
              />
              <InputAddress
                isDisabled
                label={t<string>('the associated controller')}
                value={ids?.controllerId}
              />
            </Modal.Columns>
            <Modal.Columns hint={
              <>
                <p>{t<string>('The selected validators to nominate, either via the "currently best algorithm" or via a manual selection.')}</p>
                <p>{t<string>('Once transmitted the new selection will only take effect in 2 eras since the selection criteria for the next era was done at the end of the previous era. Until then, the nominations will show as inactive.')}</p>
              </>
            }>
              <Static
                label={t<string>('selected validators')}
                value={
                  targets.map((validatorId) => (
                    <AddressMini
                      className='addressStatic'
                      key={validatorId}
                      value={validatorId}
                    />
                  ))
                }
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={ids?.controllerId}
              label={t<string>('Nominate')}
              onStart={toggleOpen}
              params={[targets]}
              tx={api.tx.staking.nominate}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(styled(Nominate)`
  .ui--AddressMini.padded.addressStatic {
    padding-top: 0.5rem;

    .ui--AddressMini-info {
      min-width: 10rem;
      max-width: 10rem;
    }
  }
`);
