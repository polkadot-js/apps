import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Table } from '@polkadot/react-components';
import { callXAgereRpc } from '../callXAgereRpc.js';
import { formatBEVM } from '../utils/formatBEVM.js';
import { Input } from '@polkadot/react-components';
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
      <div className='filter'>
        <Input
          autoFocus
          isFull
          onChange={(e) => setFilter(e.target.value)}
          label={t('filter by Subnet ID, Subnet Name, Subnet Owner')}
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
              <tr key={`${info.delegate_ss58}-${subnetId}`} className='ui--Table-Body' style={{height:'70px'}}>
                <td className='number' style={{textAlign:'start'}}>{info.ranks[index]}</td>
                <td className='address' style={{textAlign:'start'}}><AddressSmall value={info.owner_ss58} /></td>
                <td className='number' style={{textAlign:'start'}}>{info.take}</td>
                <td className='number' style={{textAlign:'start'}}>{formatBEVM(Number(info.total_stake))}</td>
                <td className='number' style={{textAlign:'start'}}>{info.nominators.length}</td>
                <td className='number' style={{textAlign:'start'}}>{formatBEVM(Number(info.total_daily_return))}</td>
              </tr>
            ))
          ))}
      </Table>
    </div>
  );
}

export default React.memo(Validator);
