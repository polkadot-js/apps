// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AuctionIndex } from '@polkadot/types/interfaces';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  id: AuctionIndex | null;
}

function Bid ({ className, id }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [firstSlot, setFirstSlot] = useState<BN | undefined>(BN_ZERO);
  const [lastSlot, setLastSlot] = useState<BN | undefined>(BN_ZERO);
  const [paraId, setParaId] = useState<BN | undefined>(BN_ZERO);
  const [isOpen, toggleOpen] = useToggle();

  const isLastError = !lastSlot || !firstSlot || lastSlot.lt(firstSlot) || lastSlot.gt(firstSlot.addn(3));

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!hasAccounts || !id}
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
              <Modal.Column>
                <InputAddress
                  label={t<string>('bid from')}
                  onChange={setAccountId}
                  type='account'
                  value={accountId}
                />
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The parachain id this bid is placed for')}>
              <Modal.Column>
                <InputNumber
                  autoFocus
                  defaultValue={paraId?.toString()}
                  isZeroable={false}
                  label={t<string>('parachain id')}
                  onChange={setParaId}
                />
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The amount to to bid for this parachain slot')}>
              <Modal.Column>
                <InputBalance
                  isZeroable={false}
                  label={t<string>('bid amount')}
                  onChange={setAmount}
                />
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The first and last slots for this bid. The last slot should be after the first and a maximum of 3 slots more than the first')}>
              <Modal.Column>
                <InputNumber
                  defaultValue={firstSlot?.toString()}
                  label={t<string>('first slot')}
                  onChange={setFirstSlot}
                />
                <InputNumber
                  defaultValue={lastSlot?.toString()}
                  isError={isLastError}
                  label={t<string>('last slot')}
                  onChange={setLastSlot}
                />
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!paraId?.gt(BN_ZERO) || !amount?.gt(BN_ZERO) || !firstSlot?.gte(BN_ZERO) || isLastError}
              label={t<string>('Bid')}
              onStart={toggleOpen}
              params={[paraId, id, firstSlot, lastSlot, amount]}
              tx={api.tx.auctions.bid}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Bid);
