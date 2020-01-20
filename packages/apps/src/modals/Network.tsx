// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Modal } from '@polkadot/react-components';
import General from '@polkadot/app-settings/General';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
}

export default function NetworkModal ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Modal
      className={className}
      header={t('Select Network')}
      open
    >
      <Modal.Content>
        <General
          isModalContent
          onClose={onClose}
        />
      </Modal.Content>
    </Modal>
  );
}
