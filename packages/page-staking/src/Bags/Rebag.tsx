// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { BagMap } from './types';

import React, { useMemo, useState } from 'react';

import { Button, InputAddress, InputAddressMulti, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle, useTxBatch } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import useBagsNodes from './useBagsNodes';

interface Props {
  bagLower: BN;
  bagUpper: BN;
  stashIds: string[];
}

function getAvailableIds (map: BagMap, bagUpper: BN): string[] {
  return Object
    .values(map[bagUpper.toString()] || {})
    .map(({ stashId }) => stashId);
}

function Rebag ({ bagUpper, stashIds }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVisible, toggleVisible] = useToggle();
  const map = useBagsNodes(stashIds);
  const availableIds = useMemo(
    () => map
      ? getAvailableIds(map, bagUpper)
      : [],
    [bagUpper, map]
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const changes = useMemo(
    () => selectedIds.map((s) => (api.tx.voterBagsList || api.tx.bagsList || api.tx.voterList).rebag(s)),
    [api, selectedIds]
  );
  const tx = useTxBatch(changes);

  if (!availableIds.length) {
    return null;
  }

  return (
    <>
      <Button
        icon='refresh'
        label={t<string>('Rebag {{count}}', { replace: { count: availableIds.length } })}
        onClick={toggleVisible}
      />
      {isVisible && (
        <Modal
          header={t<string>('Rebag dislocated entries')}
          onClose={toggleVisible}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The account that will submit the rebag transaction.')}>
              <InputAddress
                help={t<string>('Select the account you wish to rebag with.')}
                label={t<string>('rebag from account')}
                onChange={setAccountId}
                type='account'
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The accounts that will be rebagged as a result of this operation.')}>
              <InputAddressMulti
                available={availableIds}
                availableLabel={t<string>('unselected')}
                defaultValue={availableIds}
                maxCount={Number.MAX_SAFE_INTEGER}
                onChange={setSelectedIds}
                valueLabel={t<string>('to rebag')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              extrinsic={tx}
              icon='refresh'
              isDisabled={!tx || !selectedIds.length}
              label={t<string>('Rebag')}
              onStart={toggleVisible}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Rebag);
