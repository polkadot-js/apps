// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AuctionIndex, BlockNumber, LeasePeriodOf } from '@polkadot/types/interfaces';

import React, { useMemo, useState } from 'react';

import { Button, Dropdown, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useBestNumber, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { RANGES } from './constants';

interface Props {
  auctionInfo: [LeasePeriodOf, BlockNumber] | null;
  className?: string;
  id: AuctionIndex | null;
}

interface Option {
  text: string;
  value: number;
}

function Bid ({ auctionInfo, className, id }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const bestNumber = useBestNumber();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [paraId, setParaId] = useState<BN | undefined>(BN_ZERO);
  const [range, setRange] = useState(0);
  const [isOpen, toggleOpen] = useToggle();

  const rangeOpts = useMemo(
    (): Option[] => {
      const [leasePeriod] = auctionInfo || [null, null];

      if (!leasePeriod) {
        return [];
      }

      return RANGES.map(([first, last], value): Option => ({
        text: `${formatNumber(leasePeriod.addn(first))} - ${formatNumber(leasePeriod.addn(last))}`,
        value
      }));
    },
    [auctionInfo]
  );

  const [leasePeriod, endBlock] = auctionInfo || [null, null];

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!hasAccounts || !id || !leasePeriod || !endBlock || bestNumber?.gte(endBlock.add(api.consts.auctions.endingPeriod as BlockNumber))}
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
            <Modal.Columns hint={t<string>('This account will be associated with the bid. This should match the registrar for the parachain.')}>
              <InputAddress
                label={t<string>('bid from')}
                onChange={setAccountId}
                type='account'
                value={accountId}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The parachain id this bid is placed for')}>
              <InputNumber
                autoFocus
                defaultValue={paraId?.toString()}
                isZeroable={false}
                label={t<string>('parachain id')}
                onChange={setParaId}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The amount to to bid for this parachain slot')}>
              <InputBalance
                isZeroable={false}
                label={t<string>('bid amount')}
                onChange={setAmount}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The first and last slots for this bid. The last slot should be after the first and a maximum of 3 slots more than the first')}>
              <Dropdown
                label={t<string>('bid slot range (start slot, end slot)')}
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
              isDisabled={!paraId?.gt(BN_ZERO) || !amount?.gt(BN_ZERO) || !leasePeriod}
              label={t<string>('Bid')}
              onStart={toggleOpen}
              params={[paraId, id, leasePeriod?.addn(RANGES[range][0]), leasePeriod?.addn(RANGES[range][1]), amount]}
              tx={api.tx.auctions.bid}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Bid);
