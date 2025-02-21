import React, { useState } from "react"
import {BalanceFree} from '@polkadot/react-query'
import {Button, Input, InputAddress, TxButton} from '@polkadot/react-components'
import { useTranslation } from '../translate.js';
import { isAddress } from "viem"
import {useApi} from '@polkadot/react-hooks'
import InputBalance from '@polkadot/react-components/InputBalance'
import type { BN } from '@polkadot/util';
import { BN_ZERO } from '@polkadot/util';

const WasmToEvm = () => {
  const { t } = useTranslation();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [evmAccount, setEvmAccount] = useState<string>('')
  const { api } = useApi()
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);

  return (
    <div>
      <InputAddress
        label={t('using the selected account')}
        labelExtra={
          <BalanceFree
            label={<label>{t('free balance')}</label>}
            params={accountId}
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
