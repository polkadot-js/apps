/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { DerivedFees, DerivedBalances, DerivedContractFees } from '@polkadot/api-derive/types';
import { IExtrinsic } from '@polkadot/types/types';
import { ExtraFees } from './types';

import BN from 'bn.js';
import React, { useContext, useState, useEffect } from 'react';
import { Compact, UInt } from '@polkadot/types';
import { ApiContext, withCalls } from '@polkadot/react-api';
import { Icon } from '@polkadot/react-components';
import { compactToU8a, formatBalance } from '@polkadot/util';

import translate from '../translate';
import ContractCall from './ContractCall';
import ContractDeploy from './ContractDeploy';
import Proposal from './Proposal';
import Transfer from './Transfer';
import { MAX_SIZE_BYTES, MAX_SIZE_MB, ZERO_BALANCE, ZERO_FEES_BALANCES, ZERO_FEES_CONTRACT } from './constants';

interface State {
  allFees: BN;
  allTotal: BN;
  allWarn: boolean;
  extMethod?: string;
  extSection?: string;
  hasAvailable: boolean;
  isRemovable: boolean;
  isReserved: boolean;
  overLimit: boolean;
}

interface Props extends I18nProps {
  balances_fees?: DerivedFees;
  balances_all?: DerivedBalances;
  contract_fees?: DerivedContractFees;
  accountId?: string | null;
  extrinsic?: IExtrinsic | null;
  isSendable: boolean;
  onChange?: (hasAvailable: boolean) => void;
  tip?: BN;
}

const LENGTH_ADDRESS = 32 + 1; // publicKey + prefix
const LENGTH_ERA = 2; // assuming mortals
const LENGTH_SIGNATURE = 64; // assuming ed25519 or sr25519
const LENGTH_VERSION = 1; // 0x80 & version
const ZERO = new BN(0);

export const calcTxLength = (extrinsic?: IExtrinsic | null, nonce?: BN, tip?: BN): BN => {
  return new BN(
    LENGTH_VERSION +
    LENGTH_ADDRESS +
    LENGTH_SIGNATURE +
    LENGTH_ERA +
    compactToU8a(nonce || 0).length +
    compactToU8a(tip || 0).length +
    (extrinsic ? extrinsic.encodedLength : 0)
  );
};

export function FeeDisplay ({ accountId, balances_all = ZERO_BALANCE, balances_fees = ZERO_FEES_BALANCES, className, contract_fees = ZERO_FEES_CONTRACT, extrinsic, isSendable, onChange, t, tip }: Props): React.ReactElement<Props> | null {
  const { api } = useContext(ApiContext);
  const [state, setState] = useState<State>({
    allFees: ZERO,
    allTotal: ZERO,
    allWarn: false,
    hasAvailable: false,
    isRemovable: false,
    isReserved: false,
    overLimit: false
  });
  const [extra, setExtra] = useState<ExtraFees>({
    extraAmount: ZERO,
    extraFees: ZERO,
    extraWarn: false
  });

  useEffect((): void => {
    if (!accountId || !extrinsic) {
      return;
    }

    const fn = api.findCall(extrinsic.callIndex);
    const extMethod = fn.method;
    const extSection = fn.section;
    const txLength = calcTxLength(extrinsic, balances_all.accountNonce, tip);

    const isSameExtrinsic = state.extMethod === extMethod && state.extSection === extSection;
    const extraAmount = isSameExtrinsic
      ? extra.extraAmount
      : ZERO;
    const extraFees = isSameExtrinsic
      ? extra.extraFees
      : ZERO;
    const extraWarn = isSameExtrinsic
      ? extra.extraWarn
      : false;
    const allFees = extraFees
      .add(balances_fees.transactionBaseFee)
      .add(balances_fees.transactionByteFee.mul(txLength));

    const allTotal = extraAmount.add(allFees);
    const hasAvailable = balances_all.availableBalance.gtn(0);
    const isRemovable = balances_all.votingBalance.sub(allTotal).lt(balances_fees.existentialDeposit);
    const isReserved = balances_all.freeBalance.isZero() && balances_all.reservedBalance.gtn(0);
    const allWarn = extraWarn;
    const overLimit = txLength.gten(MAX_SIZE_BYTES);

    onChange && onChange(hasAvailable);

    setState({
      allFees,
      allTotal,
      allWarn,
      extMethod,
      extSection,
      hasAvailable,
      isRemovable,
      isReserved,
      overLimit
    });
  }, [accountId, balances_all, balances_fees, extra, extrinsic, balances_all.accountNonce, tip]);

  if (!accountId) {
    return null;
  }

  const { allFees, allTotal, allWarn, extMethod, extSection, hasAvailable, isRemovable, isReserved, overLimit } = state;
  const feeClass = !hasAvailable || overLimit || isRemovable
    ? 'error'
    : allWarn
      ? 'warning'
      : 'normal';

  // display all the errors, warning and information messages (in that order)
  return (
    <article
      className={[className, feeClass, 'padded'].join(' ')}
      key='txinfo'
    >
      {!isSendable && (
        <div>
          <Icon name='ban' />
          {t('The selected account does not exist on your keyring')}
        </div>
      )}
      {!hasAvailable && (
        <div>
          <Icon name='ban' />
          {t('The selected account does not have the required balance available for this transaction')}
        </div>
      )}
      {overLimit && (
        <div>
          <Icon name='ban' />
          {t(`This transaction will be rejected by the node as it is greater than the maximum size of ${MAX_SIZE_MB}MB`)}
        </div>
      )}
      {isRemovable && hasAvailable && balances_fees && (
        <div>
          <Icon name='ban' />
          {t('Submitting this transaction will drop the account balance to below the existential amount ({{existentialDeposit}}), which can result in the account being removed from the chain state and its associated funds burned.',
            {
              replace: {
                existentialDeposit: formatBalance(balances_fees.existentialDeposit)
              }
            }
          )}
        </div>
      )}
      {balances_fees && extrinsic && (
        <>
          {(extSection === 'balances' && extMethod === 'transfer') && (
            <Transfer
              amount={extrinsic.args[1]}
              fees={balances_fees}
              recipientId={extrinsic.args[0]}
              onChange={setExtra}
            />
          )}
          {(extSection === 'democracy' && extMethod === 'propose') && (
            <Proposal
              deposit={extrinsic.args[1]}
              fees={balances_fees}
              onChange={setExtra}
            />
          )}
          {(extSection === 'contract') && (
            <>
              {(extMethod === 'call') && (
                <ContractCall
                  endowment={extrinsic.args[1] as unknown as Compact<UInt>}
                  fees={contract_fees}
                  onChange={setExtra}
                />
              )}
              {(extMethod === 'create') && (
                <ContractDeploy
                  endowment={extrinsic.args[0] as unknown as Compact<UInt>}
                  fees={contract_fees}
                  onChange={setExtra}
                />
              )}
            </>
          )}
        </>
      )}
      {isReserved && (
        <div>
          <Icon name='arrow right' />
          {t('This account does have a reserved/locked balance, not taken into account')}
        </div>
      )}
      <div>
        <Icon name='arrow right' />
        {t('Fees includes the transaction fee and the per-byte fee')}
      </div>
      <div>
        <Icon name='arrow right' />
        {t('Fees totalling {{fees}} will be applied to the submission', {
          replace: {
            fees: formatBalance(allFees)
          }
        })}
      </div>
      <div>
        <Icon name='arrow right' />
        {t('{{total}} estimated total amount (fees + value)', {
          replace: {
            total: formatBalance(allTotal)
          }
        })}
      </div>
      <div>
        <Icon name='dot circle outline' />
        {t('Estimation does not account for the transaction weight')}
      </div>
    </article>
  );
}

export default translate(
  withCalls<Props>(
    'derive.balances.fees',
    ['derive.balances.all', { paramName: 'accountId' }],
    'derive.contracts.fees'
  )(FeeDisplay)
);
