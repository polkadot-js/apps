// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import {Input, InputAddress, InputBalance, Modal, TxButton} from '@polkadot/react-components';
import { useTranslation } from '../translate';
import { Available } from '@polkadot/react-query';
import { TxCallback } from '@polkadot/react-components/Status/types';
import { useApi, useCall } from '@polkadot/react-hooks';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';


interface Props {
  nodeslist?: string[],
  onClose: () => void;
  onSuccess?: TxCallback;
}

function RegisterNewNode({ nodeslist, onClose, onSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [nodeName, setNodeName] = useState<string | null | undefined>();
  const [amount, setAmount] = useState<BN | undefined>();
  const [accountId, setAccount] = useState<string | null | undefined>();
  const [availableBalance, setAvailableBalance] = useState<BN | undefined>();
  const [isTransferUnable, setIsTransferUnable] = useState<boolean>(true);
  const transferrable = <span className='label'>{t('transferrable')}</span>;

  // 移到组件顶部
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [accountId]);

  useEffect(() => {
    if (accountId) {
      const available = allBalances?.availableBalance;
      setAvailableBalance(available);

      if (available) {
        const minRequired = new BN('20002000000');  // 200.02 BEVM
        setIsTransferUnable(available.lt(minRequired));
      }
    }
  }, [accountId, allBalances]);

  // 处理金额变化
  const handleAmountChange = (value: BN | undefined) => {
    if (value && availableBalance) {
      const minStake = new BN('10000000000');  // 100 BEVM
      const minRemain = new BN('10002000000');  // 100.02 BEVM

      // 检查：
      // 1. 质押金额是否小于最小要求(100)
      // 2. 质押金额是否大于可用余额
      // 3. 剩余金额是否小于100.02
      setIsTransferUnable(
        value.lt(minStake) ||
        availableBalance.lt(value) ||
        availableBalance.sub(value).lt(minRemain)
      );
    }
    setAmount(value);
  };

  return (
    <Modal
      header={t('Register new validator')}
      size='large'
      onClose={onClose}
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            label={t('Register Account')}
            labelExtra={
              <Available
                label={transferrable}
                params={accountId}
              />
            }
            onChange={setAccount}
            type='account'
          />
          {/*<p>{t('Register new node')}</p>*/}
        </Modal.Columns>
        <Modal.Columns>
          <Input
            label={t('Validator name')}
            onChange={setNodeName}
            type='text'
          />
          {/*<p>{t('Unique and unchangeable, non-transferable after registration')}</p>*/}
        </Modal.Columns>

        <Modal.Columns hint={t('The minimum self-staking amount is fixed at 100 GEB, and accounts with a transferable balance of less than 200.002 GEB will not be able to successfully register as validator nodes.')}>
          <InputBalance
            autoFocus
            label={t('The number of tokens that the validator needs to stake')}
            onChange={handleAmountChange}
            // help={t('Minimum stake amount is 100 BEVM')}
          />
          {/* <p>{t('Number of node mortgages')}</p> */}
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          isDisabled={isTransferUnable || !amount || !nodeName || !accountId}
          accountId={accountId}
          icon='sign-in-alt'
          label={t('Register')}
          onStart={onClose}
          onSuccess={onSuccess}
          params={[nodeName, amount]}
          tx={api.tx.xStaking.register}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RegisterNewNode);
