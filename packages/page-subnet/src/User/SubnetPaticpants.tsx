import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Button, Table, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { callXAgereRpc } from '../callXAgereRpc.js';
import StakingModal from './StakingModal.js';
import { asciiToString, formatAddress, formatBEVM } from '../utils/formatBEVM.js';
import DelegateeInfo from './DelegateInfo.tsx';
import RegisterInfo from './RegisterInfo.tsx';

interface Props {
  className?: string;
  account: string;
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

function SubnetParticipants ({ className, account }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [delegateData, setDelegateData] = useState<[DelegateInfo, number][]>([]);
  const [isStakingOpen, toggleIsStakingOpen] = useToggle();
  const [isUnStakingOpen, toggleIsUnStakingOpen] = useToggle();
  const [openStakeHotAddress, setOpenStakeHotAddress] = useState<string>('');

  const header = [
    [t('Subnet ID'), 'start'],
    [t('POS'), 'start'],
    [t('Subnet Name'), 'start'],
    [t('Hot Address'), 'start'],
    [t('Your Stake'), 'start'],
    [t('Your Nominator'), 'start'],
    [t('Participants Status'), 'start'],
    [t('Operation'), 'start']
  ];

  const fetchDelegateData = (account: string) => {
    callXAgereRpc('xagere_getDelegated', [account])
    .then(response => {
      console.log('xagere_getDelegated Response:', response);
      setDelegateData(response);
    })
    .catch(error => {
      console.error('xagere_getDelegated calling RPC:', error);
      setDelegateData([]);
    });
  }
  useEffect((): void => {
    fetchDelegateData(account)
  }, [account]);


  return (
    <div className={className}>
      <RegisterInfo account={account} onSuccess={()=>fetchDelegateData(account)}/>
      <DelegateeInfo account={account} onSuccess={()=>fetchDelegateData(account)}/>
      <div style={{
        background: 'white',
        borderRadius: '0.25rem'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'normal',
          padding: '1rem',
          borderBottom: '1px solid var(--border-table)'
        }}>{t('Your Subnet Participants Status')}</h2>

        <div style={{ padding: '1rem' }}>
        <Table
          empty={t('No participants found')}
          header={header}
          style={{
            '& td': {
              padding: '1rem',
              borderBottom: '1px solid var(--border-table)',
              textAlign: 'start'
            },
          }}
        >
          {delegateData
            ?.filter(([info]) => info.owner_ss58 === account)
            ?.map(([info, stakeAmount]) => {
              const yourStake = info.nominators.find(([addr]) => addr === account)?.[1] || 0;
              return info.registrations.map((subnetId, index) => (
                <tr key={`${info.delegate_ss58}-${subnetId}`} className='ui--Table-Body' style={{height:'70px'}}>
                  <td className='number' style={{textAlign:'start'}}>{subnetId}</td>
                  <td className='number' style={{textAlign:'start'}}>{info.ranks[index]}</td>
                  <td className='text' style={{textAlign:'start'}}>{info.identities[index] ? asciiToString(info.identities[index]?.subnet_name || []) : '-'}</td>
                  <td className='text' style={{textAlign:'start'}}>{<AddressSmall value={info.delegate_ss58} />}</td>
                  <td className='number' style={{textAlign:'start'}}>{formatBEVM(Number(yourStake))}</td>
                  <td className='address' style={{textAlign:'start'}}>{info.nominators.length}</td>
                  <td className='status' style={{textAlign:'start'}}>{info.actives[index] ? t('Active') : t('Inactive')}</td>
                  <td>
                    <div style={{textAlign:'start'}}>
                      <Button
                        icon='paper-plane'
                        isDisabled={!account}
                        label={t('Stake')}
                        onClick={()=>{toggleIsStakingOpen();setOpenStakeHotAddress(info.delegate_ss58)}}
                      />
                      <Button
                        icon='paper-plane'
                        isDisabled={!account}
                        label={t('UnStake')}
                        onClick={()=>{toggleIsUnStakingOpen();setOpenStakeHotAddress(info.delegate_ss58)}}
                      />
                    </div>
                  </td>
                </tr>
              ));
            })}
        </Table>
        </div>
      </div>
      {isStakingOpen && (
                        <StakingModal
                          account={account}
                          modelName={'Stake'}
                          toggleOpen={toggleIsStakingOpen}
                          hotAddress={openStakeHotAddress}
                          type={'addStake'}
                          name={'Stake'}
                          onSuccess={()=>fetchDelegateData(account)}
                        />
                      )}
                      {isUnStakingOpen && (
                        <StakingModal account={account} modelName={'UnStake'} onSuccess={()=>fetchDelegateData(account)}
    toggleOpen={toggleIsUnStakingOpen} hotAddress={openStakeHotAddress} type={'removeStake'} name={'UnStake'}/>
                      )}
    </div>
  );
}

export default React.memo(SubnetParticipants);
