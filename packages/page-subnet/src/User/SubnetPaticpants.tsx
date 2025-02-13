import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { Button, Table, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { callXAgereRpc } from '../callXAgereRpc.js';
import StakingModal from './StakingModal.js';
import RegisterModal from './RegisterModal.tsx';
import { asciiToString, formatAddress, formatBEVM } from '../utils/formatBEVM.js';

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
  const [isRegisterOpen, toggleIsRegisterOpen] = useToggle();
  const [delegateData, setDelegateData] = useState<[DelegateInfo, number][]>([]);
  const [isStakingOpen, toggleIsStakingOpen] = useToggle();
  const [isUnStakingOpen, toggleIsUnStakingOpen] = useToggle();

  const header = [
    [t('Subnet ID'), 'start'],
    [t('POS'), 'start'],
    [t('Subnet Name'), 'start'],
    [t('Participants name'), 'start'],
    [t('Your Stake'), 'start'],
    [t('Your Nominator'), 'start'],
    [t('Miner Status'), 'start'],
    [t('Operation'), 'start']
  ];

  useEffect((): void => {
    callXAgereRpc('xagere_getDelegated', [account])
      .then(response => {
        console.log('xagere_getDelegated Response:', response);
        setDelegateData(response);
      })
      .catch(error => {
        console.error('xagere_getDelegated calling RPC:', error);
        setDelegateData([]);
      });
  }, [account]);

  return (
    <div className={className}>
      <div style={{
        background: 'white',
        borderRadius: '0.25rem',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'normal',
          padding: '1rem',
          borderBottom: '1px solid var(--border-table)'
        }}>{t('Register as a Subnet Participants')}</h2>

        <div style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem'
        }}>
          <p style={{
            color: 'var(--color-text-light)',
            margin: 0,
            flex: 1,
            paddingRight: '2rem'
          }}>{t('Register as a validator/miner for any subnet, safeguard specific mainnets, and share in BEVM rewards.')}</p>
          
          <Button
            icon='plus'
            label={t('Register')}
            onClick={toggleIsRegisterOpen}
          />
        </div>
      </div>
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
          {delegateData.map(([info, stakeAmount]) => (
            info.registrations.map((subnetId, index) => (
              <tr key={`${info.delegate_ss58}-${subnetId}`} className='ui--Table-Body' style={{height:'70px'}}>
                <td className='number' style={{textAlign:'start'}}>{subnetId}</td>
                <td className='number' style={{textAlign:'start'}}>{info.ranks[index]}</td>
                <td className='text' style={{textAlign:'start'}}>{info.identities[index] ? asciiToString(info.identities[index]?.subnet_name || []) : '-'}</td>
                <td className='text' style={{textAlign:'start'}}>{info.identities[index] ? asciiToString(info.identities[index]?.subnet_contact || []) : '-'}</td>
                <td className='number' style={{textAlign:'start'}}>{formatBEVM(Number(info.stakes[index]))}</td>
                <td className='address' style={{textAlign:'start'}}>{formatAddress(info.nominators[0]?.[0] || '-')}</td>
                <td className='status' style={{textAlign:'start'}}>{info.actives[index] ? t('Active') : t('Inactive')}</td>
                <td>
                  <div style={{textAlign:'start'}}>
                      <Button
                        icon='paper-plane'
                        isDisabled={!account}
                        label={t('Stake')}
                        onClick={toggleIsStakingOpen}
                      />
                      {isStakingOpen && (
                        <StakingModal 
                          account={account}
                          modelName={'Stake'} 
                          toggleOpen={toggleIsStakingOpen} 
                          hotAddress={info.delegate_ss58} 
                          type={'addStake'} 
                          name={'Stake'}
                        />
                      )}
                      <Button
                        icon='paper-plane'
                        isDisabled={!account}
                        label={t('UnStake')}
                        onClick={toggleIsUnStakingOpen}
                      />
                      {isUnStakingOpen && (
                        <StakingModal account={account} modelName={'UnStake'}  toggleOpen={toggleIsUnStakingOpen} hotAddress={info.delegate_ss58} type={'removeStake'} name={'UnStake'}/>
                      )}
                    </div>
                </td>
              </tr>
            ))
          ))}
        </Table>
        </div>
      </div>
      {isRegisterOpen && (
        <RegisterModal
          account={account}
          toggleOpen={toggleIsRegisterOpen}
          subnetId='1'
        />
      )}
    </div>
  );
}

export default React.memo(SubnetParticipants);
