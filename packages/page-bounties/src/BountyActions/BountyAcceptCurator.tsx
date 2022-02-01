// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { permillOf, truncateTitle } from '../helpers';
import { useBounties, useUserRole } from '../hooks';
import { useTranslation } from '../translate';

interface Props {
  curatorId: AccountId;
  description: string;
  fee: BN;
  index: BountyIndex;
}

function BountyAcceptCurator ({ curatorId, description, fee, index }: Props) {
  const { t } = useTranslation();
  const { acceptCurator } = useBounties();
  const { isCurator } = useUserRole(curatorId);
  const { bountyCuratorDeposit } = useBounties();
  const [isOpen, toggleOpen] = useToggle();

  const deposit = useMemo(() => permillOf(fee, bountyCuratorDeposit), [fee, bountyCuratorDeposit]);

  return isCurator
    ? (
      <>
        <Button
          icon='check'
          isDisabled={false}
          label={t<string>('Accept')}
          onClick={toggleOpen}
        />
        {isOpen && (
          <Modal
            header={`${t<string>('accept curator role')} - "${truncateTitle(description, 30)}"`}
            onClose={toggleOpen}
            size='large'
          >
            <Modal.Content>
              <Modal.Columns hint={t<string>('Only the account proposed as curator by the council can create the assign curator transaction')}>
                <InputAddress
                  help={t<string>('This account will accept the curator role.')}
                  isDisabled
                  label={t<string>('curator account')}
                  type='account'
                  value={curatorId.toString()}
                  withLabel
                />
              </Modal.Columns>
              <Modal.Columns hint={t<string>("This amount will be sent to your account after bounty is rewarded and you claim curator's fee.")}>
                <InputBalance
                  defaultValue={fee.toString()}
                  isDisabled
                  label={t<string>("curator's fee")}
                />
              </Modal.Columns>
              <Modal.Columns hint={t<string>('This amount will be reserved from your account and returned after bounty claim is confirmed or if you give up, unless you are slashed earlier.')}>
                <InputBalance
                  defaultValue={deposit.toString()}
                  help={t<string>("Curator's deposit is calculated based on the accepted curator's fee for this bounty.")}
                  isDisabled
                  label={t<string>("curator's deposit")}
                />
              </Modal.Columns>
            </Modal.Content>
            <Modal.Actions>
              <TxButton
                accountId={curatorId}
                icon='check'
                label={t<string>('Accept Curator Role')}
                onStart={toggleOpen}
                params={[index]}
                tx={acceptCurator}
              />
            </Modal.Actions>
          </Modal>
        )}
      </>
    )
    : null;
}

export default React.memo(BountyAcceptCurator);
