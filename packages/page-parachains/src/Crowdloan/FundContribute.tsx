// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { UInt } from '@polkadot/types';
import type { Balance, ParaId } from '@polkadot/types/interfaces';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, MarkWarning, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  cap: Balance;
  className?: string;
  paraId: ParaId;
  raised: Balance;
}

function FundContribute ({ cap, className, paraId, raised }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>();

  // TODO verifier signature

  const remaining = cap.sub(raised);
  const allowContribute = remaining.gte(api.consts.crowdloan.minContribution as UInt);
  const isAmountBelow = !amount || amount.lt(api.consts.crowdloan.minContribution as UInt);
  const isAmountOver = !!(amount && amount.gt(remaining));
  const isAmountError = isAmountBelow || isAmountOver;

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!hasAccounts || !allowContribute}
        label={t<string>('Contribute')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Contribute to campaign')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  label={t<string>('contribute from')}
                  onChange={setAccountId}
                  type='account'
                  value={accountId}
                />
              </Modal.Column>
              <Modal.Column>
                {t<string>('This account will contribute to the crowdloan.')}
              </Modal.Column>
            </Modal.Columns>
            <Modal.Columns>
              <Modal.Column>
                <InputBalance
                  autoFocus
                  isError={isAmountError}
                  isZeroable={false}
                  label={t<string>('contribution')}
                  onChange={setAmount}
                />
                {isAmountBelow && (
                  <MarkWarning content={t<string>('The amount is less than the minimum allowed contribution of {{value}}', { replace: { value: formatBalance(api.consts.crowdloan.minContribution as UInt) } })} />
                )}
                {isAmountOver && (
                  <MarkWarning content={t<string>('The amount is more than the remaining contribution needed {{value}}', { replace: { value: formatBalance(remaining) } })} />
                )}
              </Modal.Column>
              <Modal.Column>
                {t<string>('The amount to contribute. Should be less than the remaining value and more than the minimum contribution amount.')}
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleOpen}>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={isAmountError}
              label={t<string>('Contribute')}
              onStart={toggleOpen}
              params={[paraId, amount, null]}
              tx={api.tx.crowdloan.contribute}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(FundContribute);
