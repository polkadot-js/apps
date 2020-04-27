// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StakerState } from '@polkadot/react-hooks/types';

import React, { useCallback, useEffect, useState } from 'react';
import { AddressMini, Button, InputAddress, Modal, Static, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  ownNominators?: StakerState[];
  targets: string[];
}

function Nominate ({ ownNominators, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [ids, setIds] = useState<{ controllerId?: string | null; stashId: string } | null>(null);
  const [filter, setFilter] = useState<string[]>([]);
  const [isOpen, toggleOpen] = useToggle();

  useEffect((): void => {
    ownNominators && setFilter(
      ownNominators.map(({ stashId }) => stashId)
    );
  }, [ownNominators]);

  const _onChangeStash = useCallback(
    (accountId?: string | null): void => {
      const acc = ownNominators?.find(({ stashId }) => stashId === accountId);

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
        icon='hand paper outline'
        isDisabled={!filter.length || !targets.length}
        label={t('Nominate selected')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal header={t('Nominate validators')}>
          <Modal.Content>
            <Static
              label={t('selected validators')}
              value={
                targets.map((validatorId) => (
                  <AddressMini
                    key={validatorId}
                    value={validatorId}
                  />
                ))
              }
            />
            <InputAddress
              filter={filter}
              help={t('Your stash account. The transaction will be sent from the associated controller.')}
              label={t('the stash account to nominate with')}
              onChange={_onChangeStash}
              value={ids?.stashId}
            />
            <InputAddress
              isDisabled
              label={t('the associated controller')}
              onChange={_onChangeStash}
              value={ids?.controllerId}
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={ids?.controllerId}
              label={t('Nominate')}
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

export default React.memo(Nominate);
