// Copyright 2017-2021 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId, Balance } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Input, InputAddress, InputBalance, MarkError, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useMembers, useToggle } from '@polkadot/react-hooks';

import { useBounties } from './hooks';
import { useTranslation } from './translate';

interface Props {
  description: string
  index: number;
  curatorId: AccountId;
  proposals?: DeriveCollectiveProposal[];
  value: Balance;
}

function ExtendBountyExpiryAction ({ curatorId, description, index, proposals, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { isMember, members } = useMembers();
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
          icon='step-forward'
          isDisabled={false}
          label={t<string>('Extend Bounty Expiry')}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={t<string>('Extend Expiry of "$truncateTitle(description, 30)')}
            size='large'
          >
            <Modal.Content>
              <Modal.Column>
                <p>{t<string>('This action will extend expiry of chosen bounty.')}</p>
              </Modal.Column>
              <Modal.Columns>
                <Modal.Column>
                  <InputAddress
                    filter={members}
                    help={t<string>('Select the curator account you wish to use to create an extend bounty expiry action.')}
                    label={t<string>('proposing account')}
                    onChange={setAccountId}
                    type='account'
                    withLabel
                  />
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('Only curator account can extend the bounty expiry time.')}</p>
                </Modal.Column>
              </Modal.Columns>
              <Modal.Columns>
                <Modal.Column>
                  <Input
                    autoFocus
                    defaultValue={''}
                    help={t<string>('The description of this bounty')}
                    label={t<string>('bounty title')}
                    onChange={onRemarkChange}
                    value={remark}
                  />
                  {/* {!isTitleValid && (title !== TITLE_DEFAULT_VALUE) && (
                  <MarkError content={t<string>('Title too long')} />
                )} */}
                </Modal.Column>
                <Modal.Column>
                  <p>{t<string>('Description of the Bounty (to be stored on-chain)')}</p>
                </Modal.Column>
              </Modal.Columns>
            </Modal.Content>
            <Modal.Actions onCancel={toggleOpen}>
              <TxButton
                accountId={accountId}
                icon='check'
                label={t<string>('Assign curator')}
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
