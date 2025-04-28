import {useEffect, useState } from "react"
import {useApi} from '@polkadot/react-hooks'

const SCAN_API_TESTNET = 'https://scan-api-pre.bevm.io/bevmsub'
const SCAN_API_MAINNET = 'https://scan-api.bevm.io/bevmsub'
const SCAN_API_SIGNET = 'https://scan-api-pre.bevm.io/bevmsignet'

type StashedValidator = {
  accountId: string
  balance: number
  atSession: number
  blockNum: number
  eventIndex: string
  blockTimestamp: number
  name: string
  extrinsicHash: string
}

export const useGetStashedValidators = (): { data: StashedValidator[]; loading: boolean; refetch: (url: string, page: number, pageSize: number) => Promise<void>; } => {
  const [data, setData] = useState<StashedValidator[]>([])
  const [loading, setLoading] = useState(false)
  const { apiUrl } = useApi()

  const getData = async (apiUrl: string, page = 0, pageSize = 100) => {
    setLoading(true)
    const scanApi =
      apiUrl.includes('testnet') ? SCAN_API_TESTNET : apiUrl.includes('signet') ? SCAN_API_SIGNET : SCAN_API_MAINNET
    const response = await fetch(`${scanApi}/xstaking/slashedEvents?page=${page}&page_size=${pageSize}`)
    const result = await response.json()
    setLoading(false)
    setData(result?.items || [])
  }

  useEffect(() => {
    apiUrl && getData(apiUrl)
  }, [apiUrl]);

  return { data, loading, refetch: getData }
}
