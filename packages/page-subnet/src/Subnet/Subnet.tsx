import React, { useState, useEffect } from 'react';
import { Table, Input, AddressSmall } from '@polkadot/react-components';
import { useTranslation } from '../translate.js';
import { useApi } from '@polkadot/react-hooks';
import { formatBEVM } from '../Utils/formatBEVM.js';
import SubnetDetail from './SubnetDetail.js';
import TotalReturnWithTips from '../Utils/TotalReturnWithTips.js';
import { axiosXAgereRpc } from '../axiosXAgereRpc.js';

interface Props {
  className?: string;
}

interface SubnetInfo {
  netuid: number;
  agereName: string;
  owner: string;
  totalDailyReturn: number;
  recycled: number;
  burn: number;
  subnetworkNumber: number;
  maxAllowedUids: number;
}

function Subnet({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { systemChain } = useApi();
  const [selectedInfo, setSelectedInfo] = useState<SubnetInfo | null>(null);
  const [filter, setFilter] = useState('');
  const [subnets, setSubnets] = useState<SubnetInfo[]>([]);

  useEffect((): void => {
    axiosXAgereRpc('/xagere/getSubnetsInfo_v2', {}, systemChain)
    .then(response => {
      console.log('xagere_getSubnetsInfo_v2 Response:', response);
      if (Array.isArray(response)) {
        setSubnets(response);
      }
    })
    .catch(error => {
      console.error('xagere_getSubnetsInfo_v2 Error:', error);
    });
  }, [systemChain]);


  const header = [
    [t('Agere ID'), 'start', undefined],
    [t('Agere Name'), 'start', undefined],
    [t('Agere Owner'), 'start', undefined],
    [<TotalReturnWithTips value={t('Earn(24h)')}/>, 'start'],
    // [t('Earn(24h)'), 'start', undefined],
    [t('Recycled (Total)'), 'start', undefined],
    [t('Register Fee'), 'start', undefined],
    [t('Participants'), 'start', undefined]
  ];

  const filterSubnets = (data: SubnetInfo[]): SubnetInfo[] => {
    if (!filter) return data;

    const searchTerm = filter.toLowerCase();
    return data.filter((subnet) => {
      const searchableFields = [
        subnet.netuid.toString(),
        subnet.agereName,
        subnet.owner,
      ];
      return searchableFields.some(field =>
        field.toLowerCase().includes(searchTerm)
      );
    });
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  return (
    // <>
    //   {!selectedInfo ? (
    //     <div className={className}>
    //       <div style={{
    //         background: 'white',
    //         borderRadius: '0.25rem',
    //         marginBottom: '1rem',
    //         padding: '1rem'
    //       }}>
    //         <Input
    //           autoFocus
    //           isFull
    //           onChange={handleFilterChange}
    //           label={t('filter by Agere ID, Agere Name, Agere Owner')}
    //           value={filter}
    //         />
    //       </div>
    //
    //       <Table
    //         empty={t('No ageres found')}
    //         header={header}
    //         style={{
    //           '& td': {
    //             padding: '1rem',
    //             borderBottom: '1px solid var(--border-table)',
    //             textAlign: 'start'
    //           }
    //         }}
    //       >
    //         {filterSubnets(subnets)?.map((subnet) => (
    //           <tr
    //             key={subnet.netuid}
    //             onClick={() => setSelectedInfo(subnet)}
    //             style={{
    //               height: '70px',
    //               cursor: 'pointer'
    //             }}
    //           >
    //             <td>{subnet.netuid}</td>
    //             <td>{subnet.agereName}</td>
    //             <td><AddressSmall value={subnet.owner} /></td>
    //             <td>
    //               <TotalReturnWithTips key={`${subnet.netuid}`} value={formatBEVM(subnet.totalDailyReturn)}/>
    //             </td>
    //             <td>{formatBEVM(subnet.recycled)}</td>
    //             <td>{formatBEVM(subnet.burn)}</td>
    //             <td>{subnet.subnetworkNumber + "/" + subnet.maxAllowedUids}</td>
    //           </tr>
    //         ))}
    //       </Table>
    //     </div>
    //   ) : (
    //     <SubnetDetail
    //       selectedInfo={selectedInfo}
    //       onClose={() => setSelectedInfo(null)}
    //     />
    //   )}
    // </>
    <div className={className}>
      <div style={{
        background: 'white',
        borderRadius: '0.25rem',
        marginBottom: '1rem',
        padding: '1rem'
      }}>
        <Input
          autoFocus
          isFull
          onChange={handleFilterChange}
          label={t('filter by Agere ID, Agere Name, Agere Owner')}
          value={filter}
        />
      </div>

      <Table
        empty={t('No ageres found')}
        header={header}
        style={{
          '& td': {
            padding: '1rem',
            borderBottom: '1px solid var(--border-table)',
            textAlign: 'start'
          }
        }}
      >
        {filterSubnets(subnets)?.map((subnet) => (
          <tr
            key={subnet.netuid}
            onClick={() => setSelectedInfo(subnet)}
            style={{
              height: '70px',
              cursor: 'pointer'
            }}
          >
            <td>{subnet.netuid}</td>
            <td>{subnet.agereName}</td>
            <td><AddressSmall value={subnet.owner} /></td>
            <td>
              {formatBEVM(subnet.totalDailyReturn)}
              {/*<TotalReturnWithTips key={`${subnet.netuid}`} value={formatBEVM(subnet.totalDailyReturn)}/>*/}
            </td>
            <td>{formatBEVM(subnet.recycled)}</td>
            <td>{formatBEVM(subnet.burn)}</td>
            <td>{subnet.subnetworkNumber + "/" + subnet.maxAllowedUids}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Subnet);
