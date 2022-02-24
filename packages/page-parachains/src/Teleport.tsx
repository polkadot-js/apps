// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { Option } from '@polkadot/apps-config/settings/types';
import type { BN } from '@polkadot/util';

import React, { useMemo, useState } from 'react';

import { ChainImg, Dropdown, InputAddress, InputBalance, MarkWarning, Modal, Spinner, TxButton } from '@polkadot/react-components';
import { useApi, useApiUrl, useTeleport } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  onClose: () => void;
}

const INVALID_PARAID = Number.MAX_SAFE_INTEGER;
const XCM_LOC = ['xcm', 'xcmPallet', 'polkadotXcm'];

function createOption ({ info, paraId, text }: LinkOption): Option {
  return {
    text: (
      <div
        className='ui--Dropdown-item'
        key={paraId}
      >
        <ChainImg
          className='ui--Dropdown-icon'
          logo={info}
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

  const url = useMemo(
    () => destinations.find(({ paraId }, index) =>
      recipientParaId === -1
        ? index === 0
        : recipientParaId === paraId
    )?.value as string,
    [destinations, recipientParaId]
  );

  const destApi = useApiUrl(url);

  const params = useMemo(
    () => [
      {
        V1: isParaTeleport
          ? {
            interior: 'Here',
            parents: 1
          }
          : {
            interior: {
              X1: {
                ParaChain: recipientParaId
              }
            },
            parents: 0
          }
      },
      {
        V1: {
          interior: {
            X1: {
              AccountId32: {
                id: api.createType('AccountId32', recipientId).toHex(),
                network: 'Any'
              }
            }
          },
          parents: 0
        }
      },
      {
        V1: [{
          fun: {
            Fungible: amount
          },
          id: {
            Concrete: {
              interior: 'Here',
              parents: isParaTeleport
                ? 1
                : 0
            }
          }
        }]
      },
      0,
      { Unlimited: null }
    ],
    [api, amount, isParaTeleport, recipientId, recipientParaId]
  );

  const hasAvailable = !!amount;

  return (
    <Modal
      header={t<string>('Teleport assets')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}>
          <InputAddress
            label={t<string>('send from account')}
            labelExtra={
              <Available
                label={t<string>('transferrable')}
                params={senderId}
              />
            }
            onChange={setSenderId}
            type='account'
          />
        </Modal.Columns>
        {chainOpts.length !== 0 && (
          <Modal.Columns hint={t<string>('The destination chain for this asset teleport. The transferred value will appear on this chain.')}>
            <Dropdown
              defaultValue={chainOpts[0].value}
              label={t<string>('destination chain')}
              onChange={setParaId}
              options={chainOpts}
            />
            {!isParaTeleport && oneWay.includes(recipientParaId) && (
              <MarkWarning content={t<string>('Currently this is a one-way transfer since the on-chain runtime functionality to send the funds from the destination chain back to this account not yet available.')} />
            )}
          </Modal.Columns>
        )}
        <Modal.Columns hint={t<string>('The beneficiary will have access to the transferred amount when the transaction is included in a block.')}>
          <InputAddress
            label={t<string>('send to address')}
            onChange={setRecipientId}
            type='allPlus'
          />
        </Modal.Columns>
        <Modal.Columns
          hint={
            <>
              <p>{t<string>('This is the amount to be teleported to the destination chain and does not account for the source or the destination transfer fee')}</p>
              <p>{t<string>('The amount deposited to the recipient will be net the calculated cross-chain fee. If the recipient address is new, the amount deposited should be greater than the Existential Deposit')}</p>
            </>
          }
        >
          <InputBalance
            autoFocus
            isError={!hasAvailable}
            isZeroable
            label={t<string>('amount')}
            onChange={setAmount}
          />
          {destApi
            ? destApi.consts.balances
              ? (
                <>
                  <InputBalance
                    defaultValue={destApi.consts.balances.existentialDeposit}
                    isDisabled
                    label={t<string>('destination existential deposit')}
                  />
                </>
              )
              : null
            : (
              <Spinner
                label={t<string>('Retrieving destination chain fees')}
                variant='appPadded'
              />
            )
          }
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={senderId}
          icon='share-square'
          isDisabled={!allowTeleport || !hasAvailable || !recipientId || !amount || !destApi || (!isParaTeleport && recipientParaId === INVALID_PARAID)}
          label={t<string>('Teleport')}
          onStart={onClose}
          params={params}
          tx={call}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Teleport);
