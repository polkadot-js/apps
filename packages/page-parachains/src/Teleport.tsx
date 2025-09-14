// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { Option } from '@polkadot/apps-config/settings/types';
import type { BN } from '@polkadot/util';

import React, { useEffect, useMemo, useState } from 'react';

import { ChainImg, Dropdown, InputAddress, InputBalance, MarkWarning, Modal, styled, TxButton } from '@polkadot/react-components';
import { useApi, useApiUrl, useCall, useTeleport } from '@polkadot/react-hooks';
import { Available, FormatBalance } from '@polkadot/react-query';
import { BN_HUNDRED, BN_ZERO, isFunction, nextTick } from '@polkadot/util';

import { useTranslation } from './translate.js';

interface Props {
  onClose: () => void;
}

const INVALID_PARAID = Number.MAX_SAFE_INTEGER;
const XCM_LOC = ['xcm', 'xcmPallet', 'polkadotXcm'];

function getDestMultilocation (isParaTeleport: boolean | undefined, recipientParaId: number) {
  if (isParaTeleport) {
    if (recipientParaId === -1) { // para -> relay
      return {
        interior: 'Here',
        parents: 1
      };
    } else { // para -> para
      return {
        interior: {
          X1: [{
            ParaChain: recipientParaId
          }]
        },
        parents: 1
      };
    }
  }

  // relay -> para
  return {
    interior: {
      X1: [{
        ParaChain: recipientParaId
      }]
    },
    parents: 0
  };
}

function createOption ({ paraId, text, ui }: LinkOption): Option {
  return {
    text: (
      <div
        className='ui--Dropdown-item'
        key={paraId}
      >
        <ChainImg
          className='ui--Dropdown-icon'
          logo={ui.logo}
        />
        <div className='ui--Dropdown-name'>{text}</div>
      </div>
    ),
    value: paraId || -1
  };
}

function Teleport ({ onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [recipientParaId, setParaId] = useState(INVALID_PARAID);
  const { allowTeleport, destinations, isParaTeleport, oneWay } = useTeleport();
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [senderId]);
  const [maxTransfer, setMaxTransfer] = useState<BN | null>(null);

  const call = useMemo(
    (): SubmittableExtrinsicFunction<'promise'> => {
      const m = XCM_LOC.filter((x) => api.tx[x] && isFunction(api.tx[x].limitedTeleportAssets))[0];

      return api.tx[m].limitedTeleportAssets;
    },
    [api]
  );

  const chainOpts = useMemo(
    () => destinations.map(createOption),
    [destinations]
  );

  const urls = useMemo(
    () => destinations.find(({ paraId }, index) =>
      recipientParaId === -1
        ? index === 0
        : recipientParaId === paraId
    )?.providers,
    [destinations, recipientParaId]
  );

  const destApi = useApiUrl(urls);

  const params = useMemo(
    () => [
      { V4: getDestMultilocation(isParaTeleport, recipientParaId) },
      {
        V4: {
          interior: {
            X1: [{
              AccountId32: {
                id: api.createType('AccountId32', recipientId).toHex(),
                network: null
              }
            }]
          },
          parents: 0
        }
      },
      {
        V4: [{
          fun: {
            Fungible: amount
          },
          id: {
            interior: 'Here',
            parents: isParaTeleport
              ? 1
              : 0
          }
        }]
      },
      0,
      { Unlimited: null }
    ],
    [api, amount, isParaTeleport, recipientId, recipientParaId]
  );

  const hasAvailable = !!amount && (maxTransfer ? amount.lte(maxTransfer) : true);

  useEffect(() => {
    if (balances && balances.accountId.eq(senderId) && senderId && recipientId && api.call.transactionPaymentApi && api.tx.balances) {
      nextTick(async (): Promise<void> => {
        try {
          const extrinsic = call(...params);
          const { partialFee } = await extrinsic.paymentInfo(senderId);

          const adjFee = partialFee.muln(110).div(BN_HUNDRED);
          const maxTransfer = (balances.transferable || balances.availableBalance).sub(adjFee);

          setMaxTransfer(
            api.consts.balances && maxTransfer.gt(api.consts.balances.existentialDeposit)
              ? maxTransfer.sub(api.consts.balances.existentialDeposit)
              : null
          );
        } catch (error) {
          console.error(error);
        }
      });
    } else {
      setMaxTransfer(null);
    }
  }, [api.call.transactionPaymentApi, api.consts.balances, api.tx.balances, balances, call, params, recipientId, senderId]);

  return (
    <Modal
      header={t('Teleport assets')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('The transferred balance will be subtracted (along with fees) from the sender account.')}>
          <InputAddress
            label={t('send from account')}
            labelExtra={
              <Available
                label={t('transferable')}
                params={senderId}
              />
            }
            onChange={setSenderId}
            type='account'
          />
        </Modal.Columns>
        {chainOpts.length !== 0 && (
          <Modal.Columns hint={t('The destination chain for this asset teleport. The transferred value will appear on this chain.')}>
            <Dropdown
              defaultValue={chainOpts[0].value}
              label={t('destination chain')}
              onChange={setParaId}
              options={chainOpts}
            />
            {!isParaTeleport && oneWay.includes(recipientParaId) && (
              <MarkWarning content={t('Currently this is a one-way transfer since the on-chain runtime functionality to send the funds from the destination chain back to this account not yet available.')} />
            )}
          </Modal.Columns>
        )}
        <Modal.Columns hint={t('The beneficiary will have access to the transferred amount when the transaction is included in a block.')}>
          <InputAddress
            label={t('send to address')}
            onChange={setRecipientId}
            type='allPlus'
          />
        </Modal.Columns>
        <Modal.Columns
          hint={
            <>
              <p>{t('This is the amount to be teleported to the destination chain and does not account for the source or the destination transfer fee')}</p>
              <p>{t('The amount deposited to the recipient will be net the calculated cross-chain fee. If the recipient address is new, the amount deposited should be greater than the Existential Deposit')}</p>
            </>
          }
        >
          <InputBalance
            autoFocus
            isError={!hasAvailable}
            isZeroable
            label={t('amount')}
            onChange={setAmount}
          />
          {maxTransfer &&
          <StyledInfo>
            <span>Max -</span>
            <FormatBalance value={maxTransfer} />
          </StyledInfo>}
          <InputBalance
            defaultValue={destApi?.consts.balances?.existentialDeposit}
            isDisabled
            isLoading={!destApi}
            label={t('destination existential deposit')}
          />
        </Modal.Columns>
        <Modal.Columns>
          <MarkWarning
            className='warning'
            withIcon={false}
          >
            <p>{t('To ensure a successful XCM transaction, please make sure the following conditions are met:')}</p>
            <ol>
              <li>
                {t('The source account must retain a balance greater than the existential deposit after covering the fee.')}
              </li>
              <li>
                {t('The destination account must hold at least the minimum existential deposit after receiving the transfer and paying any applicable destination fees.')}
              </li>
            </ol>
          </MarkWarning>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={senderId}
          icon='share-square'
          isDisabled={!allowTeleport || !hasAvailable || !recipientId || !amount || !destApi || (!isParaTeleport && recipientParaId === INVALID_PARAID)}
          label={t('Teleport')}
          onStart={onClose}
          params={params}
          tx={call}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Teleport);

const StyledInfo = styled.p`
  align-items: center;
  display: flex;
  font-size: var(--font-size-small);
  gap: 3px;
  justify-content: flex-end;
  span:first-of-type {
    font-weight: var(--font-weight-bold);
  }
`;
