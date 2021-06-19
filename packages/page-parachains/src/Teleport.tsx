// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { Option } from '@polkadot/apps-config/settings/types';

import React, { useMemo, useState } from 'react';

import { ChainImg, Dropdown, InputAddress, InputBalance, MarkWarning, Modal, Spinner, TxButton } from '@polkadot/react-components';
import { useApi, useApiUrl, useTeleport, useWeightFee } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  onClose: () => void;
}

const DEST_WEIGHT = 3 * 1_000_000_000; // 3 * BaseXcmWeight on Kusama (on Rococo and Westend this is different)
const INVALID_PARAID = Number.MAX_SAFE_INTEGER;

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

  const destinationApi = useApiUrl(url);
  const weightFee = useWeightFee(DEST_WEIGHT, destinationApi);

  const params = useMemo(
    () => isParaTeleport
      ? [
        { X1: 'Parent' },
        { X1: { AccountId32: { id: recipientId, network: 'Any' } } },
        [{ ConcreteFungible: { amount, id: { X1: 'Parent' } } }],
        DEST_WEIGHT
      ]
      : [
        { X1: { ParaChain: recipientParaId } },
        { X1: { AccountId32: { id: recipientId, network: 'Any' } } },
        [{ ConcreteFungible: { amount, id: 'Null' } }],
        DEST_WEIGHT
      ],
    [amount, isParaTeleport, recipientId, recipientParaId]
  );

  const hasAvailable = !!amount && amount.gte(weightFee);

  return (
    <Modal
      header={t<string>('Teleport assets')}
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
        <Modal.Columns hint={
          <>
            <p>{t<string>('If the recipient account is new, the balance needs to be more than the existential deposit on the recipient chain.')}</p>
            <p>{t<string>('The amount deposited to the recipient will be net the calculated cross-chain fee.')}</p>
          </>
        }>
          <InputBalance
            autoFocus
            isError={!hasAvailable}
            isZeroable
            label={t<string>('amount')}
            onChange={setAmount}
          />
          {destinationApi
            ? (
              <>
                <InputBalance
                  defaultValue={weightFee}
                  isDisabled
                  label={t<string>('destination transfer fee')}
                />
                <InputBalance
                  defaultValue={destinationApi.consts.balances.existentialDeposit}
                  isDisabled
                  label={t<string>('destination existential deposit')}
                />
              </>
            )
            : (
              <Spinner
                label={t<string>('Retrieving destination chain fees')}
                variant='appPadded'
              />
            )
          }
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={senderId}
          icon='share-square'
          isDisabled={!allowTeleport || !hasAvailable || !recipientId || !amount || !destinationApi || (!isParaTeleport && recipientParaId === INVALID_PARAID)}
          label={t<string>('Teleport')}
          onStart={onClose}
          params={params}
          tx={
            (api.tx.xcm && api.tx.xcm.teleportAssets) ||
            (api.tx.xcmPallet && api.tx.xcmPallet.teleportAssets) ||
            (api.tx.polkadotXcm && api.tx.polkadotXcm.teleportAssets)
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Teleport);
