// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Button from './Button';
import Modal from './Modal';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  isSubmittable?: boolean;
  onCancel: () => void;
  onSend: () => void;
  submitButtonIcon?: string;
  submitButtonLabel?: string;
}

export default function TxActions ({ className, isSubmittable, onCancel, onSend, submitButtonIcon, submitButtonLabel }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Modal.Actions>
      <Button.Group className={className}>
        <Button
          icon='cancel'
          isNegative
          label={t('Cancel')}
          onClick={onCancel}
        />
        <Button.Or />
        <Button
          icon={submitButtonIcon || 'check'}
          isDisabled={!isSubmittable}
          isPrimary
          label={submitButtonLabel || t('Submit')}
          onClick={onSend}
        />
      </Button.Group>
    </Modal.Actions>
  );
}
