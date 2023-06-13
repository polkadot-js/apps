// Copyright 2017-2023 @polkadot/app-nis authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo, useState } from 'react';

import { Button, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ONE } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  isDisabled?: boolean;
  proxies: Record<string, string[]>;
}

function Bid ({ className, isDisabled, proxies }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [proxyId, setProxyId] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>();
  const [duration, setDuration] = useState<BN | undefined>();

  const tx = useMemo(
    () => accountId && amount && duration
      ? api.tx.proxy.proxy(accountId, null, api.tx.nis.placeBid(amount, duration))
      : null,
    [api, accountId, amount, duration]
  );

  const proxiedAccounts = Object.keys(proxies);
  const isAmountError = !amount || amount.isZero() || amount.lt(api.consts.nis.minBid);
  const isDurationError = !duration || !duration.gte(BN_ONE) || duration.gt(api.consts.nis.queueCount);

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!proxiedAccounts.length || isDisabled}
        label={t<string>('Bid via Proxy')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('submit nis bid')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('This account will make the bid for the nis and pay all associated fees.')}>
              <InputAddress
                filter={proxiedAccounts}
                label={t<string>('use proxied account')}
                labelExtra={
                  <Available
                    label={<span className='label'>{t<string>('transferrable')}</span>}
                    params={accountId}
                  />
                }
                onChange={setAccountId}
                type='account'
              />
              {accountId && (
                <InputAddress
                  filter={proxies[accountId]}
                  label={t<string>('send via proxy')}
                  onChange={setProxyId}
                  type='account'
                />
              )}
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The amount you wish to lock for the duration. It needs to be more than the nis minimum.')}>
              <InputBalance
                autoFocus
                defaultValue={api.consts.nis.minBid}
                isError={isAmountError}
                isZeroable={false}
                label={t<string>('bid amount')}
                onChange={setAmount}
              />
              <InputBalance
                defaultValue={api.consts.nis.minBid}
                isDisabled
                label={t<string>('minimum bid amount')}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The number of periods this bid is to be locked for, less than the maximum period.')}>
              <InputNumber
                defaultValue={BN_ONE}
                isError={isDurationError}
                isZeroable={false}
                label={t<string>('lock periods')}
                onChange={setDuration}
              />
              <InputNumber
                defaultValue={api.consts.nis.queueCount}
                isDisabled
                label={t<string>('maximum lock periods')}
              />
              {!isDurationError && (
                <InputNumber
                  defaultValue={api.consts.nis.basePeriod.mul(duration)}
                  isDisabled
                  label={t<string>('length of lock (blocks, calculated)')}
                />
              )}
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={proxyId}
              extrinsic={tx}
              icon='check'
              isDisabled={isAmountError || isDurationError || !accountId}
              label={t<string>('Bid')}
              onStart={toggleOpen}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Bid);
