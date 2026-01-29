// Copyright 2017-2025 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BountyIndex } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo, useState } from 'react';

import { Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useBlockTime } from '@polkadot/react-hooks';

import { increaseDateByBlocks } from '../helpers/increaseDateByBlocks.js';
import { truncateTitle } from '../helpers/index.js';
import { useBounties } from '../hooks/index.js';
import { useTranslation } from '../translate.js';

interface Props {
  curatorId: AccountId;
  description: string
  index: BountyIndex;
  toggleOpen: () => void;
}

function ExtendBountyExpiryAction ({ curatorId, description, index, toggleOpen }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { bountyUpdatePeriod, extendBountyExpiry } = useBounties();
  const [remark, setRemark] = useState('');
  const [blockTime, timeAsText] = useBlockTime(bountyUpdatePeriod);

  const onRemarkChange = useCallback((value: string) => {
    setRemark(value);
  }, []);

  const expiryDate = useMemo(() => bountyUpdatePeriod && increaseDateByBlocks(bountyUpdatePeriod, blockTime), [bountyUpdatePeriod, blockTime]);

  return (
    <>
      <Modal
        header={`${t('extend expiry')} - "${truncateTitle(description, 30)}"`}
        onClose={toggleOpen}
        size='large'
      >
        <Modal.Content>
          <Modal.Columns hint={t('Only curator can extend the bounty time.')}>
            <InputAddress
              isDisabled
              label={t('curator account')}
              type='account'
              value={curatorId.toString()}
              withLabel
            />
          </Modal.Columns>
          {expiryDate &&
            <Modal.Columns hint={t(`Bounty expiry time will be set to ${timeAsText} from now.`)}>
              <Input
                isDisabled
                label={t('new expiry date and time')}
                value={`${expiryDate.toLocaleDateString()} ${expiryDate.toLocaleTimeString()}`}
              />
            </Modal.Columns>
          }
          <Modal.Columns hint={t("The note that will be added to the transaction. It won't be stored on chain")}>
            <Input
              autoFocus
              defaultValue={''}
              label={t('bounty remark')}
              onChange={onRemarkChange}
              value={remark}
            />
          </Modal.Columns>
        </Modal.Content>
        <Modal.Actions>
          <TxButton
            accountId={curatorId}
            icon='check'
            label={t('Accept')}
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
