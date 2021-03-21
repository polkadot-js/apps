// Copyright 2017-2021 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button, Modal } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Bid ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [isShowing, toggleShowing] = useToggle();

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!hasAccounts}
        label={t<string>('Submit Bid')}
        onClick={toggleShowing}
      />
      {isShowing && (
        <Modal
          className={className}
          header={t<string>('submit gilt bid')}
          size='large'
        >
          <Modal.Content>
            {t<string>('TODO')}
          </Modal.Content>
          <Modal.Actions onCancel={toggleShowing} />
        </Modal>
      )}
    </>
  );
}

export default React.memo(Bid);
