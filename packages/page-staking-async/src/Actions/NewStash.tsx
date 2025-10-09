// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BondInfo } from './partials/types.js';

import React, { useCallback, useState } from 'react';

import { Button, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import BondPartial from './partials/Bond.js';

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
        label={t('Stash')}
        onClick={_toggle}
      />
      {isVisible && (
        <Modal
          header={t('Bonding Preferences')}
          onClose={_toggle}
          size='large'
        >
          <Modal.Content>
            <BondPartial onChange={setBondInfo} />
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={stashId}
              extrinsic={bondTx}
              icon='sign-in-alt'
              isDisabled={!bondTx || !stashId}
              label={t('Bond')}
              onStart={_toggle}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(NewStash);
