import React, { useRef } from 'react'
import {useGetStashedValidators} from '../useGetStashedValidators.js'
import {AddressSmall, Table} from '@polkadot/react-components'
import {FormatBalance} from '@polkadot/react-query'
import { Link } from 'react-router-dom'
import { formatNumber } from '@polkadot/util';

export const ValidatorSlashed = () => {
  const { data, loading } = useGetStashedValidators()

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [('Block'), 'start'],
    [('Time'), 'start'],
    [('Validator'), 'start'],
    [('Account'), 'start'],
    [('Slash Amount'), 'start'],
  ]);

  return (
    <Table
      empty={!loading}
      header={headerRef.current}
    >
        {
          (data || []).map(i => {
            const timestamp = new Date(i.blockTimestamp * 1000)
            return (
              <tr key={`${i.accountId}-${i.blockTimestamp}`}>
                <td style={{padding: '16px'}}>
                  <Link to={`/explorer/query/${i.blockNum}`}>{formatNumber(i.blockNum)}</Link>
                </td>
                <td>{timestamp.toLocaleString()}</td>
                <td>{i.name}</td>
                <td><AddressSmall value={i.accountId} /></td>

                <td>
                  {i.balance > 0
                    ? (
                      <FormatBalance
                        format={[10, 'SATS']}
                        value={i.balance}
                      />
                    ) : i.balance}
                </td>
              </tr>
            )
          })
        }
    </Table>
  )
}
