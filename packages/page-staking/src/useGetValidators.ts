import {useEffect, useState } from "react"
import {ValidatorInfo} from './types'
import {useApi} from '@polkadot/react-hooks'
import BigNumber from "bignumber.js"
import { hexToString } from '@polkadot/util';

const sortTotalNomination = (a: string | number, b: string | number): number => {
  const aTotalNomination = new BigNumber(a)
  const bTotalNomination = new BigNumber(b)
  return bTotalNomination.minus(aTotalNomination).toNumber()
}

function getSortList(validatorInfoList: ValidatorInfo[]) {
  let validating = validatorInfoList.filter(item => JSON.stringify(item.isValidating) === 'true')
  validating = validating.sort((a, b) => {
    return sortTotalNomination(a.totalNomination!, b.totalNomination!)
  })
  let candidate = validatorInfoList.filter(item => JSON.stringify(item.isValidating) === 'false' && JSON.stringify(item.isChilled) === 'false')
  candidate = candidate.sort((a, b) => {
    return sortTotalNomination(a.totalNomination!, b.totalNomination!)
  })
  let chill = validatorInfoList.filter(item => JSON.stringify(item.isValidating) === 'false' && JSON.stringify(item.isChilled) === 'true')
  chill = chill.sort((a, b) => {
    return sortTotalNomination(a.totalNomination!, b.totalNomination!)
  })
  const sortList = []
  sortList.push(...validating)
  sortList.push(...candidate)
  sortList.push(...chill)
  return sortList;
}

export const useGetValidators = (): { data: ValidatorInfo[]; refetch: () => Promise<void> } => {
  const [data, setData] = useState<ValidatorInfo[]>([])
  const { api, isApiReady } = useApi()

  async function getValidators() {
    const res = await api.rpc.xstaking.getValidators()

    const validatorInfoList: ValidatorInfo[] = res.toJSON()
    setData(getSortList(validatorInfoList))
    const rewardPoolData = await Promise.all(validatorInfoList.map(async (i: ValidatorInfo) => {
      const identity = await api.query.identity.identityOf(i.account)
      const formattedIdentity = identity.toJSON()
      return [formattedIdentity?.info.display.raw ? `0x${hexToString(formattedIdentity?.info.display.raw)}` : '', i.rewardPotBevmBalance]
    }))
    console.log('rewardPoolData', rewardPoolData)
  }

  useEffect(()=>{
    isApiReady && getValidators()
  },[isApiReady])

  return { data, refetch: getValidators }
}
