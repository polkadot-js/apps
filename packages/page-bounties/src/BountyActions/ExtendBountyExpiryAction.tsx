// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import React, { useCallback, useState } from 'react';

import { Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';

import { truncateTitle } from '../helpers';
import { useBounties } from '../hooks';
import { useTranslation } from '../translate';

interface Props {
  curatorId: AccountId;
  description: string
  index: BountyIndex;
  toggleOpen: () => void;
}

function ExtendBountyExpiryAction ({ curatorId, description, index, toggleOpen }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { extendBountyExpiry } = useBounties();
  const [remark, setRemark] = useState('');

  const onRemarkChange = useCallback((value: string) => {
    setRemark(value);
  }, []);

  return (
    <>
      <Modal
        header={t<string>(`Extend Expiry of "${truncateTitle(description, 30)}"`)}
        size='large'
      >
        <Modal.Content>
          <Modal.Column>
            <p>{t<string>('This action will extend expiry time of the selected bounty.')}</p>
          </Modal.Column>
          <Modal.Columns>
            <Modal.Column>
              <InputAddress
                help={t<string>('This account will be used to create an extend bounty expire transaction.')}
                isDisabled
                label={t<string>('curator account')}
                type='account'
                value={curatorId.toString()}
                withLabel
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>('Only curator can extend the bounty time.')}</p>
            </Modal.Column>
          </Modal.Columns>
          <Modal.Columns>
            <Modal.Column>
              <Input
                autoFocus
                defaultValue={''}
                help={t<string>('The note on the extension.')}
                label={t<string>('bounty remark')}
                onChange={onRemarkChange}
                value={remark}
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>("The note that will be added to the transaction. It won't be stored on chain")}</p>
            </Modal.Column>
          </Modal.Columns>
        </Modal.Content>
        <Modal.Actions onCancel={toggleOpen}>
          <TxButton
            accountId={curatorId}
            icon='check'
            label={t<string>('Accept')}
            onStart={toggleOpen}
            params={[index, remark]}
            tx={extendBountyExpiry}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default React.memo(ExtendBountyExpiryAction);
