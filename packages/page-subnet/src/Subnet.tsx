import React, { useState, useEffect } from 'react';
import { Table, FilterInput } from '@polkadot/react-components';
import { useTranslation } from './translate.js';
import { callXAgereRpc } from './callXAgereRpc.js';

interface Props {
}

interface SubnetInfo {
  id: string;
  name: string;
  owner: string;
  emissions: string;
  recycledTotal: string;
  recycled24h: string;
  lifetime: string;
}

function Subnet({ }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [subnets, setSubnets] = useState<SubnetInfo[]>([]);
  useEffect((): void => {
    callXAgereRpc('xagere_getSubnetsInfo_v2', [])  // 例如，查询最新区块号
      .then(response => {
        console.log('RPC Response:', response);
      })
      .catch(error => {
        console.error('Error calling RPC:', error);
      });
  }, []);
  const header = [
    [t('Subnet ID'), 'start'],
    [t('Subnet Name'), 'start'],
    [t('Subnet Owner'), 'start'],
    [t('Emissions'), 'start'],
    [t('Recycled (Total)'), 'start'],
    [t('Recycled (24h)'), 'start'],
    [t('Lifetime'), 'start']
  ] as [React.ReactNode?, string?, number?, (() => void)?][];

  const renderRow = (subnet: SubnetInfo) => [
    subnet.id,
    subnet.name,
    subnet.owner,
    subnet.emissions,
    subnet.recycledTotal,
    subnet.recycled24h,
    subnet.lifetime
  ];

  return (
    <div>
      <FilterInput
        // placeholder={t('filter by Subnet ID, Subnet Name, Subnet Owner')}
        value={filter}
        onChange={setFilter}
      />
      <Table
        empty={t('No subnets found')}
        header={header}
      >
        {subnets
          .filter(s =>
            filter === '' ||
            Object.values(s).some(v =>
              v.toLowerCase().includes(filter.toLowerCase())
            )
          )
          .map((subnet) => (
            <tr
              key={subnet.id}
              onClick={() => setSelectedId(subnet.id === selectedId ? null : subnet.id)}
            >
              {renderRow(subnet).map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))
        }
      </Table>
    </div>
  );
}

export default React.memo(Subnet);
