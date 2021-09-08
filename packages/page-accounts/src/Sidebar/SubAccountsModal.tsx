// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/app-accounts/translate';
import { AddressMini, Modal } from '@polkadot/react-components';
import { AccountId } from '@polkadot/types/interfaces';

interface Props {
  className?: string;
  onClose: () => void;
  subs: AccountId[];
}

function SubAccountsModal ({ className, onClose, subs }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Modal
      className={className}
      header={t<string>('sub-identities')}
      onClose={onClose}
      size='tiny'
    >
      <Modal.Content className='content'>
        {subs.map((sub) =>
          <div
            className='address'
            key={sub.toString()}
          >
            <AddressMini
              className='subs'
              isPadded={false}
              onNameClick={onClose}
              value={sub}
            />
          </div>
        )}
      </Modal.Content>
    </Modal>
  );
}

export default React.memo(styled(SubAccountsModal)`
  .ui--Modal__body {
    overflow-y: auto;
    height: 35.714rem;
  }

  .content {
    display: flex;
    flex-direction: column;

    .address {
      background-color: var(--bg-tabs);
      margin: 0.286rem 0;
      padding: 0.857rem 1.143rem;
      border: 1px solid #DFDFDF;
      border-radius: 0.286rem;
    }

    .ui--AddressMini-info {
      max-width: 24rem;
    }
  }
`);
