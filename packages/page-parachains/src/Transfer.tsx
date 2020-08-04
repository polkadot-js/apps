// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachain } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useMemo, useState } from 'react';
import { Button, Dropdown, Input, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useAccounts, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';

import { useTranslation } from './translate';

interface Props {
  parachains?: DeriveParachain[];
}

function Transfer ({ parachains }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const [isVisible, toggleVisible] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>();
  const [toId, setToId] = useState<string | null>();
  const [remark, setRemark] = useState('');

  const idOptions = useMemo((): { text: string, value: string }[] => {
    return (parachains || []).map(({ id }) => ({ text: id.toString(), value: id.toString() }));
  }, [parachains]);

  return (
    <>
      <Button
        icon='paper-plane'
        isDisabled={!parachains?.length || !allAccounts.length}
        label={t<string>('Transfer to chain')}
        onClick={toggleVisible}
      />
      {isVisible && (
        <Modal
          header={t<string>('Transfer to parachain')}
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
                <Dropdown
                  defaultValue={idOptions[0].value}
                  help={t<string>('the parachain that will receive the transfer of tokens.')}
                  label={t<string>('the parachain to transfer to')}
                  onChange={setToId}
                  options={idOptions}
                />
                <InputBalance
                  autoFocus
                  help={t<string>('the amount that should be transferred. It needs to be less than the available balance')}
                  isZeroable={false}
                  label={t<string>('amount')}
                  onChange={setAmount}
                />
                <Input
                  help={t<string>('A remark that is associated with this transfer. This can be any comment that indicates the reason.')}
                  label={t<string>('transfer remark/comment')}
                  maxLength={32}
                  onChange={setRemark}
                />
              </Modal.Column>
              <Modal.Column>
                <p>{t<string>('Transfer an amount from a specific account into a parachain.')}</p>
                <p>{t<string>('Once transferred the amount will become available on the parachain for use.')}</p>
              </Modal.Column>
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions onCancel={toggleVisible}>
            <TxButton
              accountId={accountId}
              isDisabled={!toId || !amount?.gtn(0)}
              label={t<string>('Send')}
              params={[toId, amount, remark]}
              tx='parachains.transferToParachain'
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Transfer);
