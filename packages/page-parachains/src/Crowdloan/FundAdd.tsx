// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { OwnedId, OwnerInfo } from '../types';

import React, { useState } from 'react';

import { Button, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import InputOwner from '../InputOwner';
import { useTranslation } from '../translate';

interface Props {
  bestNumber?: BN;
  className?: string;
  ownedIds: OwnedId[];
}

function FundAdd ({ bestNumber, className, ownedIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ accountId, paraId }, setOwnerInfo] = useState<OwnerInfo>({ accountId: null, paraId: 0 });
  const [cap, setCap] = useState<BN | undefined>();
  const [endBlock, setEndBlock] = useState<BN | undefined>();
  const [firstSlot, setFirstSlot] = useState<BN | undefined>();
  const [lastSlot, setLastSlot] = useState<BN | undefined>();
  const [isOpen, toggleOpen] = useToggle();

  const isEndError = !bestNumber || !endBlock || endBlock.lt(bestNumber);
  const isLastError = !lastSlot || !firstSlot || lastSlot.lt(firstSlot) || lastSlot.gt(firstSlot.addn(3));

  // TODO Add verifier

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!ownedIds.length}
        label={t<string>('Add fund')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Add campaign')}
          size='large'
        >
          <Modal.Content>
            <InputOwner
              onChange={setOwnerInfo}
              ownedIds={ownedIds}
            />
            <Modal.Columns hint={t<string>('The amount to be raised in this funding campaign')}>
              <InputBalance
                isZeroable={false}
                label={t<string>('crowdfund cap')}
                onChange={setCap}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The block until which this fund is active for')}>
              <InputNumber
                isError={isEndError}
                label={t<string>('ending block')}
                onChange={setEndBlock}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The first and last slots for this funding campaign. The last slot should be after the first and a maximum of 3 slots more than the first')}>
              <InputNumber
                label={t<string>('first slot')}
                onChange={setFirstSlot}
              />
              <InputNumber
                isError={isLastError}
                label={t<string>('last slot')}
                onChange={setLastSlot}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!paraId || !cap?.gt(BN_ZERO) || !firstSlot?.gte(BN_ZERO) || isEndError || isLastError}
              label={t<string>('Add')}
              onStart={toggleOpen}
              params={[paraId, cap, firstSlot, lastSlot, endBlock, null]}
              tx={api.tx.crowdloan.create}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(FundAdd);
