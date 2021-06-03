// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { LinkOption } from '@polkadot/apps-config/endpoints/types';
import type { Option } from '@polkadot/apps-config/settings/types';

import React, { useMemo, useState } from 'react';

import { ChainImg, Dropdown, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useTeleport } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  onClose: () => void;
}

const DEFAULT_WEIGHT = 30_000_000; // 30_000_000 as per the code
const INVALID_PARAID = Number.MAX_SAFE_INTEGER;

function createOption ({ info, paraId, text }: LinkOption, index: number): Option {
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
    value: paraId || index
  };
}

function Teleport ({ onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [hasAvailable] = useState(true);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [recipientParaId, setParaId] = useState(INVALID_PARAID);
  const { allowTeleport, destinations, isParachain } = useTeleport();

  const chainOpts = useMemo(
    () => destinations.map(createOption),
    [destinations]
  );

  const params = useMemo(
    () => isParachain
      ? [
        { X1: 'Parent' },
        { X1: { AccountId32: { id: recipientId, network: 'Any' } } },
        [{ ConcreteFungible: { amount, id: { X1: 'Parent' } } }],
        DEFAULT_WEIGHT
      ]
      : [
        { X1: { ParaChain: recipientParaId } },
        { X1: { AccountId32: { id: recipientId, network: 'Any' } } },
        [{ ConcreteFungible: { amount, id: 'Null' } }],
        DEFAULT_WEIGHT
      ],
    [amount, isParachain, recipientId, recipientParaId]
  );

  if (!allowTeleport || !chainOpts.length) {
    return null;
  }

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
        <Modal.Columns hint={t<string>('The destination chain for this asset teleport. The transferred value will appear on this chain.')}>
          <Dropdown
            defaultValue={chainOpts[0]?.value}
            label={t<string>('destination chain')}
            onChange={setParaId}
            options={chainOpts}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The beneficiary will have access to the transferred amount when the transaction is included in a block.')}>
          <InputAddress
            label={t<string>('send to address')}
            onChange={setRecipientId}
            type='allPlus'
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('If the recipient account is new, the balance needs to be more than the existential deposit on the recipient chain.')}>
          <InputBalance
            autoFocus
            isError={!hasAvailable}
            isZeroable
            label={t<string>('amount')}
            onChange={setAmount}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={senderId}
          icon='share-square'
          isDisabled={!hasAvailable || !recipientId || !amount || (!isParachain && recipientParaId === INVALID_PARAID)}
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
