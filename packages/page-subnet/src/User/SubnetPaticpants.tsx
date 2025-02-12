import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { Button, Table, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { callXAgereRpc } from '../callXAgereRpc.js';
import StakingModal from './StakingModal.js';
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
      <div className='register-section'>
        <h2>{t('Register as a Subnet Participants')}</h2>
        <div style={{display:'flex', justifyContent:'space-between', flexDirection:'row', alignItems:'center'}}>
          <p>{t('Register as a validator/miner for any subnet, safeguard specific mainnets, and share in BEVM rewards.')}</p>
          <TxButton
            accountId={account}
            icon='plus'
            label={t('Register')}
            onStart={() => {}}
            params={['1', account]}
            tx={api.tx['xAgere']['burnedRegister']}
          />
        </div>
      </div>

      <div className='status-section'>
        <h2>{t('Your Subnet Participants Status')}</h2>
        <Table
          empty={t('No participants found')}
          header={header}
        >
          {delegateData.map(([info, stakeAmount]) => (
            info.registrations.map((subnetId, index) => (
              <tr key={`${info.delegate_ss58}-${subnetId}`}>
                <td>{subnetId}</td>
                <td>{info.ranks[index]}</td>
                <td>{info.identities[index] ? asciiToString(info.identities[index]?.subnet_name || []) : '-'}</td>
                <td>{info.identities[index] ? asciiToString(info.identities[index]?.subnet_contact || []) : '-'}</td>
                <td>{formatBEVM(Number(info.stakes[index]))}</td>
                <td>{formatAddress(info.nominators[0]?.[0] || '-')}</td>
                <td>{info.actives[index] ? t('Active') : t('Inactive')}</td>
                <td>
                  <Button.Group>
                    <Button.Group>
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
                        <StakingModal modelName={'UnStake'}  toggleOpen={toggleIsUnStakingOpen} hotAddress={info.delegate_ss58} type={'removeStake'} name={'UnStake'}/>
                      )}
                    </Button.Group>
                  </Button.Group>
                </td>
              </tr>
            ))
          ))}
        </Table>
      </div>

      {/*<div className='qa-section'>*/}
      {/*  <h2>{t('Subnet Miner Registration Q&A')}</h2>*/}
      {/*  /!* Q&A 部分可以使用折叠面板组件 *!/*/}
      {/*</div>*/}
    </div>
  );
}

export default React.memo(SubnetParticipants);
