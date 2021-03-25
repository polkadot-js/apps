// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { BlockNumber } from '@polkadot/types/interfaces';
import type { AuctionInfo, OwnedId, OwnerInfo } from '../types';

import React, { useMemo, useState } from 'react';

import { Button, Dropdown, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useBestNumber, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO, formatNumber } from '@polkadot/util';

import InputOwner from '../InputOwner';
import { useTranslation } from '../translate';
import { RANGES } from './constants';

interface Props {
  auctionInfo: AuctionInfo;
  className?: string;
  ownedIds: OwnedId[];
}

interface Option {
  text: string;
  value: number;
}

function Bid ({ auctionInfo, className, ownedIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const bestNumber = useBestNumber();
  const [{ accountId, paraId }, setOwnerInfo] = useState<OwnerInfo>({ accountId: null, paraId: 0 });
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [range, setRange] = useState(0);
  const [isOpen, toggleOpen] = useToggle();

  const rangeOpts = useMemo(
    (): Option[] =>
      auctionInfo.leasePeriod
        ? RANGES.map(([first, last], value): Option => ({
          text: `${formatNumber(auctionInfo.leasePeriod?.addn(first))} - ${formatNumber(auctionInfo.leasePeriod?.addn(last))}`,
          value
        }))
        : [],
    [auctionInfo]
  );

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!ownedIds.length || !hasAccounts || !auctionInfo.numAuctions || !auctionInfo.leasePeriod || !auctionInfo.endBlock || bestNumber?.gte(auctionInfo.endBlock.add(api.consts.auctions.endingPeriod as BlockNumber))}
        label={t<string>('Bid')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Place bid')}
          size='large'
        >
          <Modal.Content>
            <InputOwner
              onChange={setOwnerInfo}
              ownedIds={ownedIds}
            />
            <Modal.Columns hint={t<string>('The amount to to bid for this parachain period range.')}>
              <InputBalance
                isZeroable={false}
                label={t<string>('bid amount')}
                onChange={setAmount}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The first and last lease period for this bid. The last lease period should be after the first and a maximum of 3 more than the first.')}>
              <Dropdown
                label={t<string>('bid period range (first period - last period)')}
                onChange={setRange}
                options={rangeOpts}
                value={range}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!paraId || !amount?.gt(BN_ZERO) || !auctionInfo.leasePeriod}
              label={t<string>('Bid')}
              onStart={toggleOpen}
              params={[paraId, auctionInfo.numAuctions, auctionInfo.leasePeriod?.addn(RANGES[range][0]), auctionInfo.leasePeriod?.addn(RANGES[range][1]), amount]}
              tx={api.tx.auctions.bid}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Bid);
