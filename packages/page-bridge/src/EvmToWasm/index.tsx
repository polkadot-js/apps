import { useConnectModal } from "@rainbow-me/rainbowkit"
import React, { useState } from "react"
import {Button, Input, InputAddress, styled} from '@polkadot/react-components'
import { useAccount, useBalance, useDisconnect, useSwitchChain, useWriteContract } from "wagmi";
import {BalanceFree} from '@polkadot/react-query'
import {useTranslation} from '../translate.js'
import InputBalance from '@polkadot/react-components/InputBalance'
import type { BN } from '@polkadot/util';
import { BN_ZERO } from '@polkadot/util';
import {useApi, useCall} from '@polkadot/react-hooks'
import {BEVM_ADDRESSES, Erc20Abi, SYSTEM_BRIDGE_ADDRESSES, SystemBridgeAbi} from '../contract/index.js'
import type {ActionStatus} from '@polkadot/react-components/Status/types'
import {readContract, waitForTransactionReceipt } from "wagmi/actions";
import {wagmiConfig} from '@polkadot/react-hooks/ctx/Wagmi'
import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';
import BigNumber from 'bignumber.js'

const AddressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  > .ui--Labelled {
    flex-grow: 1;
    max-width: 70%;
  }
`

const getChainId = (chainName?: string): number | undefined => {
  if (!chainName) return
  chainName = chainName.toString()
  if (chainName.includes('Stack')) {
    return 11504
  } else if (chainName.includes('Testnet')) {
    return 11503
  } else {
    return 11501
  }
}

interface Props {
  onStatusChange: (status: ActionStatus) => void;
}

const EvmToWasm = ({ onStatusChange }: Props) => {
  const { t } = useTranslation();
  const {openConnectModal} = useConnectModal()
  const { disconnect } = useDisconnect()
  const { address } = useAccount()
  const [accountId, setAccountId] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [isInTx, setIsInTx] = useState<boolean>(false);
  const { api } = useApi()
  const chainInfo = useCall(api.rpc.system.chain)
  const chainId = getChainId(chainInfo as string)
  const systemBridgeAddress = SYSTEM_BRIDGE_ADDRESSES[chainId as number]
  const bevmTokenAddress = BEVM_ADDRESSES[chainId as number]
  const { writeContractAsync } = useWriteContract()
  const { switchChainAsync } = useSwitchChain()
  const { data: bevmBalance } = useBalance({
    chainId,
    address: address && bevmTokenAddress ? address : undefined,
    token: bevmTokenAddress as `0x${string}`
  })

  const handleTx = async () => {
    if (!systemBridgeAddress || !amount || !chainId) return
    try {
      setIsInTx(true)
      await switchChainAsync({ chainId })

      //判断是否需要approve
      const allowance: any = await readContract(wagmiConfig, {
        chainId,
        address: bevmTokenAddress as `0x${string}`,
        abi: Erc20Abi,
        functionName: 'allowance',
        args: [address, systemBridgeAddress],
      })
      if (Number(allowance) < amount.toNumber()) {
        const hash = await writeContractAsync({
          chainId,
          address: bevmTokenAddress as `0x${string}`,
          abi: Erc20Abi,
          functionName: 'approve',
          args: [systemBridgeAddress, BigInt(amount.toNumber())]
        })

        await waitForTransactionReceipt(wagmiConfig, { hash, chainId, confirmations: 2 })
      }

      const pubkey = decodeAddress(accountId);

      // 转换为十六进制字符串
      const hexPubkey = u8aToHex(pubkey);

      const hash = await writeContractAsync({
        chainId,
        address: systemBridgeAddress as `0x${string}`,
        abi: SystemBridgeAbi,
        functionName: 'withdrawGov',
        args: [BigInt(amount.toNumber()), hexPubkey]
      })

      const tx = await waitForTransactionReceipt(wagmiConfig, { hash, chainId, confirmations: 2 })

      console.log('tx', tx)

      onStatusChange({
        action: 'WithdrawGov',
        status: tx.status === 'success' ? 'success' : 'error',
        message: tx.status === 'success' ? 'Successful transaction!' : 'Failed transaction!'
      })

    } catch (e: any) {
      const errorMessage = e?.response?.data || e?.message || e

      onStatusChange({
        action: 'WithdrawGov',
        status: 'error',
        message: errorMessage
      })
    } finally {
      setIsInTx(false)
    }

  }

  return (
    <div>
      <AddressWrapper>
        <Input
          isReadOnly
          autoFocus
          label={'Evm Address'}
          value={address}
          labelExtra={(
            <span>
              {/*@ts-ignore*/}
              Balance: <span style={{'text-transform': 'uppercase'}}>{new BigNumber(bevmBalance?.formatted || 0).toFixed(4)} GEB</span>
            </span>
          )}
        />
        {address ? (
          <Button
            isReadOnly={false}
            icon="link-slash"
            label={'Disconnect'}
            onClick={disconnect}
          />
        ) : (
          <Button
            isReadOnly={false}
            icon='plus'
            label={'Connect Wallet'}
            onClick={openConnectModal}
          />
        )}
      </AddressWrapper>

      <InputAddress
        label={'to account'}
        labelExtra={
          <BalanceFree
            label={<label>{t('free balance')}</label>}
            params={accountId}
          />
        }
        onChange={setAccountId}
        type='account'
      />
      <InputBalance
        isError={Number(amount) <= 0}
        isZeroable
        placeholder={'0'}
        label={t('amount')}
        onChange={setAmount}
        labelExtra={'(enter value in standard units)'}
      />
      <Button.Group>
        <Button
          isDisabled={!systemBridgeAddress || Number(amount) <= 0 || isInTx || !accountId || !address}
          isReadOnly={false}
          icon='sign-in-alt'
          label={t('Submit Transaction')}
          onClick={handleTx}
        />
      </Button.Group>
    </div>
  )
}

export default React.memo(EvmToWasm)
