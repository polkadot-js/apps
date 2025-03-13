import React, { useState } from "react"
import {Button, Input, InputAddress, TxButton} from '@polkadot/react-components'
import { useTranslation } from '../translate.js';
import { isAddress } from "viem"
import {useApi, useCall} from '@polkadot/react-hooks'
import InputBalance from '@polkadot/react-components/InputBalance'
import type { BN } from '@polkadot/util';
import { BN_ZERO } from '@polkadot/util';
import {FormatBalance} from '@polkadot/react-query'
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

const WasmToEvm = () => {
  const { t } = useTranslation();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [evmAccount, setEvmAccount] = useState<string>('')
  const { api } = useApi()
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const allBalances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [accountId]);

  return (
    <div>
      <InputAddress
        label={t('using the selected account')}
        labelExtra={
          <FormatBalance
            label={<label>{t('free balance')}</label>}
            value={allBalances?.availableBalance}
          />
        }
        onChange={setAccountId}
        type='account'
      />

      <Input
        defaultValue={evmAccount}
        isError={!isAddress(evmAccount)}
        label={t('To Evm Address')}
        onChange={setEvmAccount}
        placeholder={t('0x...')}
      />
      <InputBalance
        isError={Number(amount) <= 0}
        isZeroable
        placeholder={'0'}
        label={t('amount')}
        // maxValue={maxTransfer}
        onChange={setAmount}
        labelExtra={'(enter value in standard units)'}
      />
      <Button.Group>
        <TxButton
          isDisabled={!evmAccount || Number(amount) <= 0 || !accountId}
          accountId={accountId}
          params={[evmAccount, amount]}
          tx={api.tx.xAssetsBridge.depositGovTokenToEvm}
          icon='sign-in-alt'
          label={t('Submit Transaction')}
        />
      </Button.Group>
    </div>
  )
}

export default React.memo(WasmToEvm)
