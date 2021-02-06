// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  bestNumber?: BN;
  className?: string;
}

function FundAdd ({ bestNumber, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [cap, setCap] = useState<BN | undefined>();
  const [endBlock, setEndBlock] = useState<BN | undefined>();
  const [firstSlot, setFirstSlot] = useState<BN | undefined>();
  const [lastSlot, setLastSlot] = useState<BN | undefined>();
  const [paraId, setParaId] = useState<BN | undefined>();
  const [isOpen, toggleOpen] = useToggle();

  const isEndError = !bestNumber || !endBlock || endBlock.lt(bestNumber);
  const isLastError = !lastSlot || !firstSlot || lastSlot.eq(BN_ZERO) || lastSlot.lte(firstSlot) || lastSlot.gt(firstSlot.addn(3));

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!hasAccounts}
        label={t<string>('Add campaign')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Add campaign')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  label={t<string>('propose from')}
                  onChange={setAccountId}
                  type='account'
                  value={accountId}
                />
              </Modal.Column>
              <Modal.Column>
                {t<string>('This account will be associated with the fund and pay the deposit. This should match the registrar for the parachain.')}
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputNumber
                  autoFocus
                  isZeroable={false}
                  label={t<string>('parachain id')}
                  onChange={setParaId}
                />
              </Modal.Column>
              <Modal.Column>
                {t<string>('The parachain id this campaign refers to')}
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputBalance
                  isZeroable={false}
                  label={t<string>('crowdfund cap')}
                  onChange={setCap}
                />
              </Modal.Column>
              <Modal.Column>
                {t<string>('The amount to be raised in this funding campaign')}
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputNumber
                  isError={isEndError}
                  label={t<string>('ending block')}
                  onChange={setEndBlock}
                />
              </Modal.Column>
              <Modal.Column>
                {t<string>('The block until which this campaign is active for')}
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputNumber
                  isZeroable={false}
                  label={t<string>('first slot')}
                  onChange={setFirstSlot}
                />
                <InputNumber
                  isError={isLastError}
                  isZeroable={false}
                  label={t<string>('last slot')}
                  onChange={setLastSlot}
                />
              </Modal.Column>
              <Modal.Column>
                {t<string>('The first and last slots for this funding campaign. The last slot should be after the first and a maximum of 3 slots more than the first')}
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!paraId?.gt(BN_ZERO) || !cap?.gt(BN_ZERO) || !firstSlot?.gt(BN_ZERO) || isEndError || isLastError}
              onStart={toggleOpen}
              params={[paraId, cap, firstSlot, lastSlot, endBlock]}
              tx={api.tx.crowdloan.create}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(FundAdd);
