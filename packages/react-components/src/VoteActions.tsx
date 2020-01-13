// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Button from './Button';
import Modal from './Modal';
import TxButton from './TxButton';
import { useTranslation } from './translate';

interface Props {
  accountId: string | null;
  className?: string;
  isDisabled?: boolean;
  onClick: () => void;
  params: any[];
  tx: string;
}

export default function VoteActions ({ accountId, className, isDisabled, onClick, params, tx }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Modal.Actions>
      <Button.Group className={className}>
        <Button
          icon='cancel'
          isNegative
          label={t('Cancel')}
          onClick={onClick}
        />
        <Button.Or />
        <TxButton
          accountId={accountId}
          icon='check'
          isDisabled={!accountId || isDisabled}
          isPrimary
          label={t('Vote')}
          onClick={onClick}
          params={params}
          tx={tx}
        />
      </Button.Group>
    </Modal.Actions>
  );
}
