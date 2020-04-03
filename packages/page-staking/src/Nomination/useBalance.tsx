import { useState, useEffect } from 'react';
import {useApi, useCall} from '@polkadot/react-hooks/index';
import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { formatNumber } from '@polkadot/util';
import { Balance } from '@polkadot/types/interfaces/runtime';
import BN from 'bn.js';
import { formatBalance } from '@polkadot/util';

// Known account we want to use (available on dev chain, with funds)

export function useBalance (address?: string | null): string | null  {
  const api = useApi();
  const balancesAll = useCall<DeriveBalancesAll>(api.api.derive.balances.all as any, [address]);
  return balancesAll ? formatNumber(balancesAll.freeBalance) : null
}

export function useBalanceClear (address?: string | null): Balance | null  {
  const api = useApi();
  const balancesAll = useCall<DeriveBalancesAll>(api.api.derive.balances.all as any, [address]);
  return balancesAll ? balancesAll.freeBalance : null
}

export function useFees (bondedAddress?: string | null, senderAddress?: string | null): Balance | null  {
  const [paymentFees, setPaymentFees] = useState();
  const [bondFees, setBondFees] = useState();
  const [wholeFees, setWholeFees] = useState();
  const api = useApi();
  const existentialDeposit = api.api.consts.balances.existentialDeposit;
  const si = formatBalance.findSi('-');
  const TEN = new BN(10);
  const basePower = formatBalance.getDefaults().decimals;
  const siPower = new BN(basePower + si.power);
  const amount = new BN(1000).mul(TEN.pow(siPower));

  async function getPaymentFees(addr1: string, addr2: string) {
    const fees = await api.api.tx.balances.transfer(addr1, amount).paymentInfo(addr2);
    setPaymentFees(fees.partialFee);
  }

  async function getBondFees(addr1: string, addr2: string) {
    const fees = await api.api.tx.staking.bond(addr1, amount, 2).paymentInfo(addr2);
    setBondFees(fees.partialFee);
  }

  useEffect(() => {
    if (paymentFees && bondFees) {
      let whole = bondFees.iadd(paymentFees).iadd(existentialDeposit);
      setWholeFees(whole);
    }
  }, [paymentFees, bondFees]);

  useEffect(() => {
    if (bondedAddress && senderAddress) {
      getPaymentFees(bondedAddress, senderAddress);
      getBondFees(bondedAddress, senderAddress);
    }
  }, [bondedAddress, senderAddress]);

  return wholeFees;
}

export default useBalance;
