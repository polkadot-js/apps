import BigNumber from "bignumber.js"
import { useEffect, useState } from "react"
import {useApi} from '@polkadot/react-hooks'

function toPrecision(value: number, precision = 0, paddingZero = true): number | string {
  precision = Number(precision);
  const big = new BigNumber(value).dividedBy(Math.pow(10, precision));

  if (paddingZero) {
    return big.toFixed(precision);
  } else {
    return big.toNumber();
  }
}

export const useRemainingVotes = (validatorInfo?: { selfBonded?: string; totalNomination?: string }): { data: string; refetch: () => Promise<void> } => {
  const [remainingVotesData, setRemainingVotesData] = useState<string>('')
  const { api, isApiReady } = useApi()

  async function getRemainingVotesData(){
    const res = await api.query.xStaking.upperBoundFactorOfAcceptableVotes()
    const upperVotesData = res.toJSON()

    const ownVotes: BigNumber = new BigNumber(validatorInfo?.selfBonded || 0)
    const totalVotes: BigNumber = new BigNumber(validatorInfo?.totalNomination || 0)
    const bgResult: BigNumber = new BigNumber(toPrecision(ownVotes.toNumber() * upperVotesData - totalVotes.toNumber(), 8))
    const result: string = bgResult.toNumber().toFixed(4)
    setRemainingVotesData(result)
  }

  useEffect(() => {
    isApiReady && validatorInfo && getRemainingVotesData()
  }, [isApiReady, JSON.stringify(validatorInfo)])

  return { data: remainingVotesData, refetch: getRemainingVotesData }
}
