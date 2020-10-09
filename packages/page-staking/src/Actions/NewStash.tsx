// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BondInfo } from './partials/types';

import React, { useCallback, useState } from 'react';
import { Button, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import BondPartial from './partials/Bond';

function NewStash (): React.ReactElement {
  const { t } = useTranslation();
  const [isVisible, toggleVisible] = useToggle();
  const [{ bondTx, stashId }, setBondInfo] = useState<BondInfo>({});

  const _toggle = useCallback(
    (): void => {
      setBondInfo({});
      toggleVisible();
    },
    [toggleVisible]
  );

  return (
    <>
      <Button
        icon='plus'
        key='new-stash'
        label={t<string>('Stash')}
        onClick={_toggle}
      />
      {isVisible && (
        <Modal
          header={t<string>('Bonding Preferences')}
          size='large'
        >
          <Modal.Content>
            <BondPartial onChange={setBondInfo} />
          </Modal.Content>
          <Modal.Actions onCancel={_toggle}>
            <TxButton
              accountId={stashId}
              extrinsic={bondTx}
              icon='sign-in-alt'
              isDisabled={!bondTx || !stashId}
              label={t<string>('Bond')}
              onStart={_toggle}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(NewStash);
