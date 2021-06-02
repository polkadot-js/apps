// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useMemo, useState } from 'react';

import { Dropdown, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useTeleport } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ZERO, isNumber } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  onClose: () => void;
}

const INVALID_PARAID = 666_666_666;

function Teleport ({ onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [hasAvailable] = useState(true);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [paraId, setParaId] = useState(INVALID_PARAID);
  const { destinations } = useTeleport();

  const chainOpts = useMemo(
    () => destinations
      .map(({ paraId, text }) => [paraId, text])
      .filter((v): v is [number, string] => isNumber(v[0]))
      .map(([value, text]) => ({ text, value })),
    [destinations]
  );

  return (
    <Modal
      header={t<string>('Teleport funds')}
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
        <Modal.Columns hint={t<string>('The destination parachain for this asset teleport')}>
          <Dropdown
            defaultValue={chainOpts[0] && chainOpts[0].value}
            label={t<string>('destination parachain')}
            onChange={setParaId}
            options={chainOpts}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The beneficiary will have access to the transferred fees when the transaction is included in a block.')}>
          <InputAddress
            label={t<string>('send to address')}
            onChange={setRecipientId}
            type='allPlus'
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('If the recipient account is new, the balance needs to be more than the existential deposit. Likewise if the sending account balance drops below the same value, the account will be removed from the state.')}>
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
          isDisabled={!hasAvailable || !recipientId || !amount || paraId === INVALID_PARAID}
          label={t<string>('Teleport')}
          onStart={onClose}
          params={[
            { X1: { ParaChain: paraId } },
            { X1: { AccountId32: { id: recipientId, network: 'Any' } } },
            [
              { ConcreteFungible: { amount, id: 'Null' } }
            ],
            // FIXME We need to actually calculate this weight
            100_000_000
          ]}
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
