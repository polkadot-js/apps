// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Modal from './Modal';
import TxButton from './TxButton';
import { useTranslation } from './translate';

interface Props {
  accountId: string | null;
  aye: boolean;
  className?: string;
  isDisabled?: boolean;
  onClick: () => void;
  params: any[];
  tx: string;
}

function VoteActions ({ accountId, aye, className = '', isDisabled, onClick, params, tx }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Modal.Actions
      className={className}
      onCancel={onClick}
    >
      <TxButton
        accountId={accountId}
        icon='check'
        isDisabled={!accountId || isDisabled}
        label={aye
          ? t<string>('Vote Aye')
          : t<string>('Vote Nay')}
        onStart={onClick}
        params={params}
        tx={tx}
      />
    </Modal.Actions>
  );
}

export default React.memo(VoteActions);
