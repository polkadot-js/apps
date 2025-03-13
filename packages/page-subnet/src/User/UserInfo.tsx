import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Button, Table, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import StakingModal from './StakingModal.tsx';
import { formatAddress, formatBEVM } from '../Utils/formatBEVM.ts';
import TotalReturnWithTips from '../Utils/TotalReturnWithTips.js';
import { FormatBalance } from '@polkadot/react-query';
import UnStakingModal from './UnStakingModal.tsx';
import { axiosXAgereRpc } from '../axiosXAgereRpc.js';

interface Props {
  className?: string;
  account: string;
}

interface DelegateInfo {
  delegator: string;
  totalDailyReturn: number;
  totalStakeAmount: number;
  yourStakeAmount: number;
  yourDailyReturn: number;
}


function UserInfo ({ className, account }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { systemChain } = useApi();
  const [isStakingOpen, toggleIsStakingOpen] = useToggle();
  const [isUnStakingOpen, toggleIsUnStakingOpen] = useToggle();
  const [isDelegateOpen, toggleIsDelegateOpen] = useToggle();
  const [openStakeHotAddress, setOpenStakeHotAddress] = useState<string>('');
  const [unStakeAmount, setUnStakeAmount] = useState<string>();


  const [delegateData, setDelegateData] = useState<DelegateInfo[]>([]);

  const header = [
    [t('Delegator'), 'start'],
    [<TotalReturnWithTips value={t('Your Earn(24h)')}/>, 'start'],
    [t('Total Stake Amount'), 'start'],
    [t('Your Stake Amount'), 'start'],
    [t('Operation'), 'start']
  ];

  const fetchDelegatedData = (account: string, systemChain: string) => {
    if(!account || !systemChain) return
    axiosXAgereRpc('/xagere/getDelegated', {
      address: account
    }, systemChain)
    .then(response => {
      if (response && Array.isArray(response)) {
        setDelegateData(response as DelegateInfo[]);
      } else {
        console.error('xagere_getDelegated response format:', response);
        setDelegateData([]);
      }
    })
    .catch(error => {
      console.error('xagere_getDelegates calling RPC:', error);
      setDelegateData([]);
    });
  }


  useEffect((): void => {
    fetchDelegatedData(account, systemChain)
  }, [account, systemChain]);

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
        }}>{t('Delegate Your GEB')}</h2>

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
          }}>{t('Delegate to the auditor, and you can share a portion of GEB rewards. Please click the button to proceed with your staking!')}</p>

          <Button
            icon='paper-plane'
            isDisabled={!account}
            label={t('Delegate GEB')}
            onClick={() => window.location.href = '/#/agere/auditor'}
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
        }}>{t('Your delegation position')}</h2>

        <div style={{ background: 'transparent' }}>
          <Table
            empty={t('No delegation data available')}
            header={header}
            style={{
              '& td': {
                padding: '1rem',
                borderBottom: '1px solid var(--border-table)',
                textAlign: 'left'
              },
              '& td.number': {
                fontFamily: 'var(--font-mono)',
                textAlign: 'right'
              }
            }}
          >
            {delegateData?.map((info, index) => (
              <tr key={index}>
                <td>{<AddressSmall value={info.delegator} />}</td>
                <td>{formatBEVM(info.yourDailyReturn)}</td>
                {/*<td><TotalReturnWithTips key={`${info.delegator}`} value={formatBEVM(info.yourDailyReturn)}/></td>*/}
                <td>{formatBEVM(info.totalStakeAmount)}</td>
                <td>{formatBEVM(info.yourStakeAmount)}</td>
                <td>
                  <div style={{textAlign:'start'}}>
                    <Button
                      icon='paper-plane'
                      isDisabled={!account}
                      label={t('Stake')}
                      onClick={()=>{toggleIsStakingOpen();setOpenStakeHotAddress(info.delegator)}}
                    />
                    <Button
                      icon='paper-plane'
                      isDisabled={!account}
                      label={t('UnStake')}
                      onClick={()=>{toggleIsUnStakingOpen();setOpenStakeHotAddress(info.delegator);setUnStakeAmount(formatBEVM(info.yourStakeAmount))}}
                    />

                  </div>
                </td>
              </tr>
            ))}
          </Table>
          {isStakingOpen && (
                      <StakingModal
                        account={account}
                        modelName={'Stake'}
                        toggleOpen={toggleIsStakingOpen}
                        hotAddress={openStakeHotAddress}
                        type={'addStake'}
                        name={'Stake'}
                        onSuccess={()=> fetchDelegatedData(account, systemChain)}
                      />
                    )}
                    {isUnStakingOpen && (
                      <UnStakingModal
                        account={account}
                        modelName={'UnStake'}
                        onSuccess={()=> fetchDelegatedData(account, systemChain)}
                        toggleOpen={toggleIsUnStakingOpen}
                        hotAddress={openStakeHotAddress}
                        type={'removeStake'}
                        name={'UnStake'}
                        showAmountInfo={ <FormatBalance
                          className={className}
                          label={'stake amount'}
                        >{unStakeAmount}</FormatBalance>}
                      />
                    )}
        </div>
      </div>

      {isDelegateOpen && (
        <StakingModal
          account={account}
          modelName={'Stake'}
          toggleOpen={toggleIsDelegateOpen}
          hotAddress={account}
          type={'addStake'}
          name={'Stake'}
          onSuccess={()=> fetchDelegatedData(account, systemChain)}
        />
      )}
    </div>
  );
}

export default React.memo(UserInfo);
