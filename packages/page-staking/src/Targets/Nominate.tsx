// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StakerState } from '@polkadot/react-hooks/types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressMini, Button, InputAddress, Modal, Static, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

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
  const [ids, setIds] = useState<IdState | null>(null);
  const [filter, setFilter] = useState<string[]>([]);
  const [isOpen, toggleOpen] = useToggle();

  useEffect((): void => {
    ownNominators && setFilter(
      ownNominators.map(({ stashId }) => stashId)
    );
  }, [ownNominators]);

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
        isDisabled={isDisabled || !filter.length || !targets.length}
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
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  filter={filter}
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
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('One of your available nomination accounts, keyed by the stash. The transaction will be sent from the controller.')}</p>
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
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
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('The selected validators to nominate, either via the "currently best algorithm" or via a manual selection.')}</p>
                <p>{t<string>('Once transmitted the new selection will only take effect in 2 eras since the selection criteria for the next era was done at the end of the previous era. Until then, the nominations will show as inactive.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={ids?.controllerId}
              label={t<string>('Nominate')}
              onStart={toggleOpen}
              params={[targets]}
              tx='staking.nominate'
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

    .ui--AddressMini-address {
      min-width: 10rem;
      max-width: 10rem;
    }
  }
`);
