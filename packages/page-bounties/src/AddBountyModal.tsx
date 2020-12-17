// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/app-accounts/translate';
import { ModalProps } from '@polkadot/app-accounts/types';
import { Button, Input, InputBalance, Modal } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { BN_ZERO } from '@polkadot/util';
import { KeypairType } from '@polkadot/util-crypto/types';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
  seed?: string;
  type?: KeypairType;
}

function AddBountyModal ({ className = '', onClose }: Props) {
  const { t } = useTranslation();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);

  console.log(amount);

  return (
    <Modal
      className={`ui--AddBountyModal ${className}`}
      header={t<string>('Add bounty')}
    >
      <Modal.Content>
        <Button icon='times'
          isIcon
          onClick={onClose}/>
        <Input
          autoFocus
          help={t<string>('')}
          label={t<string>('bounty title')}
          onChange={setTitle}
          placeholder={t<string>('bounty title')}
          value={title}
        />
        <InputBalance
          help={t<string>('')}
          isZeroable
          label={t<string>('bounty requested allocation')}
          onChange={setAmount}
          value={ amount }
        />
      </Modal.Content>
    </Modal>
  );
}

export default React.memo(styled(AddBountyModal)`
  .content {
    .ui--Button {
      position: absolute;
      top: 12px;
      right: 12px;
    }
  }
`);
