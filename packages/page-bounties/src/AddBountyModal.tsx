// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/app-accounts/translate';
import { ModalProps } from '@polkadot/app-accounts/types';
import { countBountyBond } from '@polkadot/app-bounties/helpers/countBountyBond';
import { Button, Input, InputBalance, Modal, Static } from '@polkadot/react-components';
import { ActionStatus } from '@polkadot/react-components/Status/types';
import { useApi } from '@polkadot/react-hooks';
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
  const { api } = useApi();

  const bountyDepositBase = api.consts.treasury.bountyDepositBase;
  const bountyDepositPerByte = api.consts.treasury.dataDepositPerByte;

  const [title, setTitle] = useState('');
  const [bond, setBond] = useState(bountyDepositBase.toBn());
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);

  const onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
    setBond(countBountyBond(title, bountyDepositBase, bountyDepositPerByte));
  };

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
          onChange={(e) => onInputChange(e)}
          placeholder={t<string>('bounty title')}
          value={title}
        />
        <Static
          help={t<string>('Calculated bond for bounty')}
          label={t<string>('bounty bond')}
        >
          {bond}
        </Static>
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
