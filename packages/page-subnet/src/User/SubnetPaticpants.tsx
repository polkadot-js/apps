import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Button, Table, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import StakingModal from './StakingModal.js';
import { formatBEVM } from '../Utils/formatBEVM.js';
import DelegateeInfo from './DelegateInfo.tsx';
import RegisterInfo from './RegisterInfo.tsx';
import TotalReturnWithTips from '../Utils/TotalReturnWithTips.js';
import { axiosXAgereRpc } from '../axiosXAgereRpc.js';

interface Props {
  className?: string;
  account: string;
}

interface HotkeyInfo {
  netuid: number,
  rank: number,
  subnetIdentity: string;
  hotKey: string;
  coldkey: string;
  totalDailyReturn: number;
  totalStakeAmount: number;
  yourStakeAmount: number;
  yourDailyReturn: number;
  validatorTrust: number;
  validatorPermit: boolean;
  trust: number;
}

function SubnetParticipants ({ className, account }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { systemChain } = useApi();
  const [delegateData, setDelegateData] = useState<HotkeyInfo[]>([]);
  const [isStakingOpen, toggleIsStakingOpen] = useToggle();
  const [isUnStakingOpen, toggleIsUnStakingOpen] = useToggle();
  const [openStakeHotAddress, setOpenStakeHotAddress] = useState<string>('');

  const header = [
    [t('Agere ID'), 'start'],
    [t('POS'), 'start'],
    [t('Agere Name'), 'start'],
    [t('Hot Address'), 'start'],
    [t('Your Stake'), 'start'],
    [<TotalReturnWithTips value={t('Your Earn(24h)')}/>, 'start'],
    // [t('Your Earn(24h)'), 'start'],
    [t('Auditor status'), 'start'],
    [t('Auditor Permit'), 'start'],
    [t('Executor status'), 'start'],
    [t('Operation'), 'start']
  ];

  const fetchDelegateData = (account: string, systemChain: string) => {
    if(!account || !systemChain) return
    axiosXAgereRpc('/xagere/getColdkeyOwnedHotkeysInfo', {address: account}, systemChain)
      .then(response => {
        console.log('xagere_getColdkeyOwnedHotkeysInfo Response:', response);
        if (Array.isArray(response)) {
          setDelegateData(response);
        }
      })
      .catch(error => {
        console.error('xagere_getColdkeyOwnedHotkeysInfo calling RPC:', error);
        setDelegateData([]);
      });
  };

  useEffect((): void => {
    fetchDelegateData(account, systemChain)
  }, [account, systemChain]);

  return (
    <div className={className}>
      <RegisterInfo account={account} onSuccess={()=>fetchDelegateData(account, systemChain)}/>
      <DelegateeInfo account={account} onSuccess={()=>fetchDelegateData(account, systemChain)}/>
      <div style={{
        background: 'white',
        borderRadius: '0.25rem'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'normal',
          padding: '1rem',
        }}>{t('Your Agere Participants Status')}</h2>

        <div style={{ background: 'transparent' }}>
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
          {delegateData?.map(
              (info)=>{
                return <tr key={`${info.hotKey}-${info.netuid}`} className='ui--Table-Body' style={{height:'70px'}}>
                  <td className='number' style={{textAlign:'start'}}>{info.netuid}</td>
                  <td className='number' style={{textAlign:'start'}}>{info.rank}</td>
                  <td className='text' style={{textAlign:'start'}}>{info.subnetIdentity}</td>
                  <td className='text' style={{textAlign:'start'}}>{<AddressSmall value={info.hotKey} />}</td>
                  <td className='number' style={{textAlign:'start'}}>{formatBEVM(info.yourStakeAmount)}</td>
                  <td className='number' style={{textAlign:'start'}}>
                    {formatBEVM(info.yourDailyReturn)}
                    {/*<TotalReturnWithTips key={`${info.hotKey}-${info.netuid}`} value={formatBEVM(info.yourDailyReturn)}/>*/}
                  </td>
                  <td style={{textAlign:'start'}}>{info.validatorTrust > 0 ? t('Active') : t('Inactive')}</td>
                  <td style={{textAlign:'start'}}>{info.validatorPermit ? t('Yes') : t('No')}</td>
                  <td className='status' style={{textAlign:'start'}}>{info.trust > 0 ? t('Active') : t('Inactive')}</td>
                  <td>
                    <div style={{textAlign:'start'}}>
                      <Button
                        icon='plus'
                        isDisabled={!account}
                        label={t('Stake')}
                        onClick={()=>{toggleIsStakingOpen();setOpenStakeHotAddress(info.hotKey)}}
                      />
                      <Button
                        icon='minus'
                        isDisabled={!account}
                        label={t('UnStake')}
                        onClick={()=>{toggleIsUnStakingOpen();setOpenStakeHotAddress(info.hotKey)}}
                      />
                    </div>
                  </td>
                </tr>
              }
            )}
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
                          onSuccess={()=>fetchDelegateData(account, systemChain)}
                        />
                      )}
                      {isUnStakingOpen && (
                        <StakingModal account={account} modelName={'UnStake'} onSuccess={()=>fetchDelegateData(account, systemChain)}
    toggleOpen={toggleIsUnStakingOpen} hotAddress={openStakeHotAddress} type={'removeStake'} name={'UnStake'}/>
                      )}
    </div>
  );
}

export default React.memo(SubnetParticipants);
