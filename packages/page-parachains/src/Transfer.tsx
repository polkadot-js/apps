// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { DeriveParachain } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Input, InputAddress, InputBalance, InputNumber, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  parachains?: DeriveParachain[];
}

function Transfer ({ className, parachains }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [isVisible, toggleVisible] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>();
  const [paraId, setParaId] = useState<string | BN | null>(null);
  const [remark, setRemark] = useState('');
  const [isParachain, setIsParachain] = useState(true);

  const idOptions = useMemo((): { text: string, value: string }[] => {
    return (parachains || []).map(({ id }) => ({ text: id.toString(), value: id.toString() }));
  }, [parachains]);

  const extrinsic = useMemo(
    (): SubmittableExtrinsic<'promise'> | null => {
      if (amount?.gtn(0)) {
        if (api.query.parachainUpgrade) {
          return recipientId
            ? isParachain
              ? api.tx.tokenDealer.transferTokensToParachainChain(paraId, recipientId, amount)
              : api.tx.tokenDealer.transferTokensToRelayChain(recipientId, amount)
            : null;
        } else {
          return api.tx.parachains.transferToParachain(paraId, amount, remark);
        }
      }

      return null;
    },
    [amount, api, isParachain, paraId, recipientId, remark]
  );

  const isActionDisabled = !allAccounts.length || (
    api.query.parachains
      ? !parachains?.length
      : !api.query.parachainUpgrade
  );

  return (
    <>
      <Button
        icon='paper-plane'
        isDisabled={isActionDisabled}
        label={t<string>('Transfer to chain')}
        onClick={toggleVisible}
      />
      {isVisible && (
        <Modal
          className={className}
          header={t<string>('Transfer to chain')}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns>
              <Modal.Column>
                <InputAddress
                  help={t<string>('The account you will send funds from.')}
                  label={t<string>('send from account')}
                  labelExtra={
                    <Available
                      label={t<string>('transferrable ')}
                      params={accountId}
                    />
                  }
                  onChange={setAccountId}
                  type='account'
                />
                <InputAddress
                  help={t<string>('The account that will receive the funds')}
                  isDisabled={!api.query.parachainUpgrade}
                  label={t<string>('send to address')}
                  onChange={setRecipientId}
                  value={
                    api.query.parachainUpgrade
                      ? recipientId
                      : accountId
                  }
                />
                {isParachain && (
                  api.query.parachainUpgrade
                    ? (
                      <InputNumber
                        help={t<string>('the parachain that will receive the transfer of tokens.')}
                        label={t<string>('the parachain to transfer to')}
                        onChange={setParaId}
                      />
                    )
                    : (
                      <Dropdown
                        defaultValue={idOptions[0].value}
                        help={t<string>('the parachain that will receive the transfer of tokens.')}
                        label={t<string>('the parachain to transfer to')}
                        onChange={setParaId}
                        options={idOptions}
                      />
                    )
                )}
                <InputBalance
                  autoFocus
                  help={t<string>('the amount that should be transferred. It needs to be less than the available balance')}
                  isZeroable={false}
                  label={t<string>('amount')}
                  onChange={setAmount}
                />
                {api.query.parachains && (
                  <Input
                    help={t<string>('A remark that is associated with this transfer. This can be any comment that indicates the reason.')}
                    label={t<string>('transfer remark/comment')}
                    maxLength={32}
                    onChange={setRemark}
                  />
                )}
                {api.query.parachainUpgrade && (
                  <Toggle
                    className='togglePara'
                    label={t<string>('send funds to another parachain (not relay)')}
                    onChange={setIsParachain}
                    value={isParachain}
                  />
                )}
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Transfer an amount from a specific account into a parachain.')}</p>
                <p>{t<string>('Once transferred the amount will become available on the chain for use.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleVisible}>
            <TxButton
              accountId={accountId}
              extrinsic={extrinsic}
              label={t<string>('Send')}
              onStart={toggleVisible}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(styled(Transfer)`
  .togglePara {
    marin-top: 0.5rem;
    text-align: right;
  }
`);
