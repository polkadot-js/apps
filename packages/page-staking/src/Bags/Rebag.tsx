// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo, useState } from 'react';

import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle, useTxBatch } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import useBagsNodes from './useBagsNodes';

interface Props {
  bagLower: BN;
  bagUpper: BN;
  stashIds: string[];
}

function Rebag ({ bagUpper, stashIds }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [isVisible, toggleVisible] = useToggle();
  const map = useBagsNodes(stashIds);
  const changes = useMemo(
    () => map && Object
      .values(map[bagUpper.toString()] || {})
      .map(({ stashId }) => api.tx.bagsList.rebag(stashId)),
    [api, bagUpper, map]
  );
  const tx = useTxBatch(changes);

  if (!changes || !changes.length) {
    return null;
  }

  return (
    <>
      <Button
        icon='refresh'
        label={t<string>('Rebag {{count}}', { replace: { count: changes.length } })}
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
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              extrinsic={tx}
              icon='refresh'
              isDisabled={!tx}
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
