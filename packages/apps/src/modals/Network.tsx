// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Modal } from '@polkadot/react-components';
import General from '@polkadot/app-settings/General';

import translate from '../translate';

interface Props extends I18nProps {
  onClose: () => void;
}

function NetworkModal ({ className, onClose, t }: Props): React.ReactElement<Props> {
  return (
    <Modal
      className={className}
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Select Network')}</Modal.Header>
      <Modal.Content>
        <General
          isModalContent
          onClose={onClose}
        />
      </Modal.Content>
    </Modal>
  );
}

export default translate(NetworkModal);
