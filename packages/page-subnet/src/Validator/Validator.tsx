import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import {  Table } from '@polkadot/react-components';
import { callXAgereRpc } from '../callXAgereRpc.js';
import { formatBEVM } from '../utils/formatBEVM.js';

interface Props {
  className?: string;
}

interface SubnetIdentity {
    subnet_name: number[];
    github_repo: number[];
    subnet_contact: number[];
}

interface DelegateInfo {
    delegate_ss58: string;
    take: number;
    nominators: [string, string][];
    owner_ss58: string;
    registrations: number[];
    identities: (SubnetIdentity | null)[];
    actives: boolean[];
    stakes: string[];
    ranks: number[];
    validator_permits: number[];
    return_per_1000: string;
    total_daily_return: string;
    total_stake: string;
  }
function Validator({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [subnets, setSubnets] = useState<DelegateInfo[]>([]);
  const [filter, setFilter] = useState<string>('');

  useEffect((): void => {
    callXAgereRpc('xagere_getDelegates', [])
      .then(response => {
        console.log('Subnets Response:', response);
        if (response && Array.isArray(response)) {
          setSubnets(response);
        }
      })
      .catch(error => {
        console.error('Error fetching subnets:', error);
      });
  }, []);

  const header = [
    [t('Pos'), 'start'],
    [t('Hot Address'), 'start'],
    [t('Take'), 'start'],
    [t('Total Stake'), 'start'],
    [t('Nominator'), 'start'],
    [t('Total Daily Return'), 'start'],
  ];

  return (
    <div className={className}>
      <div className='filter-section'>
        <input
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t('filter by Subnet ID, Subnet Name, Subnet Owner')}
          value={filter}
        />
      </div>



      <Table
        empty={t('No subnets found')}
        header={header}
      >
          {subnets.filter(s =>
            filter === '' ||
            Object.values(s).some(v =>
              String(v).toLowerCase().includes(filter.toLowerCase())
            )
          ).map((info) => (
            info.registrations.map((subnetId, index) => (
              <tr key={`${info.delegate_ss58}-${subnetId}`}>
                <td>{info.ranks[index]}</td>
                <td>{info.owner_ss58}</td>
                <td>{info.take}</td>
                <td>{formatBEVM(Number(info.total_stake))}</td>
                <td>{info.nominators.length}</td>
                <td>{info.total_daily_return}</td>
              </tr>
            ))
          ))}
      </Table>
    </div>
  );
}

export default React.memo(Validator); 