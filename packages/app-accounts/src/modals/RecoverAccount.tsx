// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Modal } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
}

export default function RecoverAccount ({ className, onClose }: Props): React.ReactElement {
  const { t } = useTranslation();

  return (
    <Modal
      className={className}
      header={t('Recover a recoverable account')}
    >
      <Modal.Actions onCancel={onClose}>nothing</Modal.Actions>
    </Modal>
  )
}
