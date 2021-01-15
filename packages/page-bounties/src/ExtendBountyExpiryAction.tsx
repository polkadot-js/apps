// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo, useState } from 'react';

import { Button, Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';

import { truncateTitle } from './helpers';
import { useBounties } from './hooks';
import { useTranslation } from './translate';

interface Props {
  description: string
  index: number;
  curatorId: AccountId;
}

function ExtendBountyExpiryAction ({ curatorId, description, index }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { extendBountyExpiry } = useBounties();
  const [isOpen, toggleOpen] = useToggle();
  const { allAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [remark, setRemark] = useState('');
  const isCurator = useMemo(() => allAccounts.includes(curatorId.toString()), [allAccounts, curatorId]);

  const onRemarkChange = useCallback((value: string) => {
    setRemark(value);
  }, []);

  return isCurator
    ? (
      <>
        <Button
          icon='calendar-plus'
          isDisabled={false}
          label={t<string>('Extend Bounty Expiry')}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={t<string>(`Extend Expiry of "${truncateTitle(description, 30)}"`)}
            size='large'
          >
            <Modal.Content>
              <Modal.Column>
                <p>{t<string>('This action will extend expiry of the selected bounty.')}</p>
              </Modal.Column>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    help={t<string>('This account will be used to create an extend bounty expire transaction.')}
                    isDisabled
                    label={t<string>('curator account')}
                    onChange={setAccountId}
                    type='account'
                    value={curatorId.toString()}
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('Only curator account can extend the bounty expiry time.')}</p>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Column>
                The remark on bounty time extension:
              </Modal.Column>
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
                  <p>{t<string>('The note that will be added to the transaction.')}</p>
                </Modal.Column>
              </Modal.Columns>
            </Modal.Content>
            <Modal.Actions onCancel={toggleOpen}>
              <TxButton
                accountId={accountId}
                icon='check'
                label={t<string>('Extend bounty time')}
                onStart={toggleOpen}
                params={[index, remark]}
                tx={extendBountyExpiry}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    )
    : null;
}

export default React.memo(ExtendBountyExpiryAction);
