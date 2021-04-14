// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AuctionInfo, LeasePeriod, OwnedId, OwnerInfo } from '../types';

import React, { useState } from 'react';

import { Button, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BN_ONE, BN_ZERO } from '@polkadot/util';

import InputOwner from '../InputOwner';
import { useTranslation } from '../translate';
import useRanges from '../useRanges';

interface Props {
  auctionInfo?: AuctionInfo;
  bestNumber?: BN;
  className?: string;
  leasePeriod?: LeasePeriod;
  ownedIds: OwnedId[];
}

function FundAdd ({ auctionInfo, bestNumber, className, leasePeriod, ownedIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const ranges = useRanges();
  const [{ accountId, paraId }, setOwnerInfo] = useState<OwnerInfo>({ accountId: null, paraId: 0 });
  const [cap, setCap] = useState<BN | undefined>();
  const [endBlock, setEndBlock] = useState<BN | undefined>();
  const [firstSlot, setFirstSlot] = useState<BN | undefined>();
  const [lastSlot, setLastSlot] = useState<BN | undefined>();
  const [isOpen, toggleOpen] = useToggle();

  const maxPeriods = ranges[ranges.length - 1][1] - ranges[0][0];
  const isEndError = !bestNumber || !endBlock || endBlock.lt(bestNumber);
  const isFirstError = !firstSlot || (!!leasePeriod && firstSlot.lt(leasePeriod.currentPeriod));
  const isLastError = !lastSlot || !firstSlot || lastSlot.lt(firstSlot) || lastSlot.gt(firstSlot.addn(maxPeriods));
  const defaultSlot = (auctionInfo?.leasePeriod || leasePeriod?.currentPeriod.add(BN_ONE) || 1).toString();

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
            <Modal.Columns hint={t<string>('The amount to be raised in this funding campaign.')}>
              <InputBalance
                isZeroable={false}
                label={t<string>('crowdfund cap')}
                onChange={setCap}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The end block for contributions to this fund.')}>
              <InputNumber
                isError={isEndError}
                label={t<string>('ending block')}
                onChange={setEndBlock}
              />
            </Modal.Columns>
            <Modal.Columns hint={
              <>
                <p>{t<string>('The first and last lease periods for this funding campaign.')}</p>
                <p>{t<string>('The ending lease period should be after the first and a maximum of {{maxPeriods}} periods more than the first', { replace: { maxPeriods } })}</p>
              </>
            }>
              <InputNumber
                defaultValue={defaultSlot}
                isError={isFirstError}
                label={t<string>('first period')}
                onChange={setFirstSlot}
              />
              <InputNumber
                defaultValue={defaultSlot}
                isError={isLastError}
                label={t<string>('last period')}
                onChange={setLastSlot}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!paraId || !cap?.gt(BN_ZERO) || isEndError || isFirstError || isLastError}
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
