// Copyright 2019 @polkadot/app-generic-asset authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, InputAddress, InputBalance, TxButton, Dropdown } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { withMulti, withObservable } from '@polkadot/react-api/hoc';
import { BN_ZERO } from '@polkadot/util';

import assetRegistry, { AssetsSubjectInfo } from './assetsRegistry';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
  assets?: AssetsSubjectInfo;
}

interface Option {
  text: string;
  value: string;
}

function Transfer ({ assets, className = '', onClose, recipientId: propRecipientId, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [assetId, setAssetId] = useState('0');
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [recipientId, setRecipientId] = useState(propRecipientId || null);
  const [senderId, setSenderId] = useState(propSenderId || null);

  // build up our list of options via assets
  useEffect((): void => {
    setOptions(Object.entries(assets || {}).map(([value, name]): Option => ({
      text: `${name} (${value})`,
      value
    })));
  }, [assets]);

  // create an extrinsic if we have correct values
  useEffect((): void => {
    setExtrinsic(
      recipientId && senderId && amount
        ? api.tx.genericAsset.transfer(assetId, recipientId, amount)
        : null
    );
  }, [api, amount, assetId, recipientId, senderId]);

  const _onAddAssetId = (id: string): void => {
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    if (id.trim().match(/^\d+$/)) {
      assetRegistry.add(id, id);
    }
  };

  const transferrable = <span className='label'>{t<string>('transferrable')}</span>;

  return (
    <div>
      <div className={className}>
        <InputAddress
          defaultValue={propSenderId}
          help={t<string>('The account you will send funds from.')}
          isDisabled={!!propSenderId}
          label={t<string>('send from account')}
          labelExtra={
            <Available
              label={transferrable}
              params={senderId}
            />
          }
          onChange={setSenderId}
          type='account'
        />
        <InputAddress
          defaultValue={propRecipientId}
          help={t<string>('Select a contact or paste the address you want to send funds to.')}
          isDisabled={!!propRecipientId}
          label={t<string>('send to address')}
          labelExtra={
            <Available
              label={transferrable}
              params={recipientId}
            />
          }
          onChange={setRecipientId}
          type='allPlus'
        />
        <Dropdown
          allowAdd
          help={t<string>('Enter the Asset ID of the token you want to transfer.')}
          label={t<string>('asset id')}
          onAdd={_onAddAssetId}
          onChange={setAssetId}
          options={options}
          value={assetId}
        />
        <InputBalance
          help={t<string>('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
          label={t<string>('amount')}
          onChange={setAmount}
        />
      </div>
      <Button.Group>
        <TxButton
          accountId={senderId}
          extrinsic={extrinsic}
          icon='paper-plane'
          label={t<string>('Make Transfer')}
          onStart={onClose}
        />
      </Button.Group>
    </div>
  );
}

export default withMulti(
  styled(Transfer)`
    article.padded {
      box-shadow: none;
      margin-left: 2rem;
    }

    .balance {
      margin-bottom: 0.5rem;
      text-align: right;
      padding-right: 1rem;

      .label {
        opacity: 0.7;
      }
    }

    label.with-help {
      flex-basis: 10rem;
    }
  `,
  withObservable(assetRegistry.subject, { propName: 'assets' })
);
