import {useEffect, useState } from "react"

const SCAN_API = 'https://multiscan-api-pre.coming.chat'

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

export const useGetStashedValidators = (): { data: StashedValidator[]; loading: boolean; refetch: (page: number, pageSize: number) => Promise<void>; } => {
  const [data, setData] = useState<StashedValidator[]>([])
  const [loading, setLoading] = useState(false)

  const getData = async (page = 0, pageSize = 100) => {
    setLoading(true)
    const response = await fetch(`${SCAN_API}/bevmsub/xstaking/slashedEvents?page=${page}&page_size=${pageSize}`)
    const result = await response.json()
    setLoading(false)
    setData(result?.items || [])
  }

  useEffect(() => {
    getData()
  }, []);

  return { data, loading, refetch: getData }
}
