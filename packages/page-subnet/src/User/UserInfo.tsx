import React, { useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { Button, Table, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useToggle } from '@polkadot/react-hooks';
import { callXAgereRpc } from '../callXAgereRpc.js';
import StakingModal from './StakingModal.tsx';

interface Props {
  className?: string;
}

interface DelegateInfo {
  delegate_ss58: string;
  take: number;
  nominators: [string, number][];
  owner_ss58: string;
  registrations: number[];
  validator_permits: number[];
  return_per_1000: number;
  total_daily_return: number;
}

type DelegateData = [DelegateInfo, number];

function UserInfo ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const [isStakingOpen, toggleIsStakingOpen] = useToggle();
  const [isUnStakingOpen, toggleIsUnStakingOpen] = useToggle();
  const [isDelegateOpen, toggleIsDelegateOpen] = useToggle();

  const [delegateData, setDelegateData] = useState<DelegateData[]>([]);

  // 格式化 BEVM 数量，添加千分位并截断到合适的小数位
  const formatBEVM = (amount: number): string => {
    // 将数值除以 1e9 (假设 9 位小数)
    const value = amount / 1_000_000_000;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // 格式化地址，显示前6位和后4位
  const formatAddress = (address: string): string => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const calculateTotalStake = (nominators: [string, number][]): number => {
    return nominators.reduce((sum, [_, amount]) => sum + amount, 0);
  };

  const header = [
    [t('Delegator'), 'start'],
    [t('Total Daily Return'), 'start'],
    [t('Total Stake Amount'), 'start'],
    [t('Your Stake Amount'), 'start'],
    [t('Operation'), 'start']
  ];

  useEffect((): void => {
    callXAgereRpc('xagere_getStakeInfoForColdkey', [hasAccounts ? allAccounts[0] : ''])  // 例如，查询最新区块号
      .then(response => {
        console.log('xagere_getStakeInfoForColdkey Response:', response);
      })
      .catch(error => {
        console.error('xagere_getStakeInfoForColdkey calling RPC:', error);
      });
  }, []);

  useEffect((): void => {
    callXAgereRpc('xagere_getDelegates', [])  // 例如，查询最新区块号
      .then(response => {
        console.log('xagere_getDelegates Response:', response);
      })
      .catch(error => {
        console.error('xagere_getDelegates calling RPC:', error);
      });
  }, []);

  useEffect((): void => {
    callXAgereRpc('xagere_getDelegated', [hasAccounts ? allAccounts[0] : ''])
      .then(response => {
        console.log('xagere_getDelegated Response:', response);
        if (response && Array.isArray(response)) {
          setDelegateData(response as DelegateData[]);
        } else {
          console.error('xagere_getDelegated response format:', response);
          setDelegateData([]);
        }
      })
      .catch(error => {
        console.error('xagere_getDelegates calling RPC:', error);
        setDelegateData([]);
      });
  }, []);

  return (
    <div className={className}>
      <div className='delegate-section'>
        <div className='delegate-header'>
          <h2>{t('Delegate Your BEVM')}</h2>
          <Button
            icon='paper-plane'
            isDisabled={!hasAccounts}
            label={t('Delegate BEVM')}
            onClick={toggleIsDelegateOpen}
          />
          {isDelegateOpen && (
            <StakingModal  toggleOpen={toggleIsDelegateOpen} hotAddress={hasAccounts ? allAccounts[0] : ''} type={'addStake'} name={'Stake'}/>
          )}
        </div>
        <p>{t('Delegate to the registrant you believe is suitable, and you can share a portion of their rewards. Please click the button to proceed with your staking!')}</p>
      </div>

      <div className='position-section'>
        <h2>{t('Your delegation position')}</h2>
        <Table
          header={header}
          empty={t('No delegation data available')}
        >
          {delegateData?.map(([info, stakeAmount], index) => (
            <tr key={index}>
              <td>{formatAddress(info.delegate_ss58)}</td>
              <td>{formatBEVM(info.total_daily_return)} BEVM</td>
              <td>{formatBEVM(calculateTotalStake(info.nominators))} BEVM</td>
              <td>{formatBEVM(stakeAmount)} BEVM</td>
              <td>
                <Button.Group>
                  <Button
                    icon='paper-plane'
                    isDisabled={!hasAccounts}
                    label={t('Stake')}
                    onClick={toggleIsStakingOpen}
                  />
                  {isStakingOpen && (
                    <StakingModal  toggleOpen={toggleIsStakingOpen} hotAddress={info.delegate_ss58} type={'addStake'} name={'Stake'}/>
                  )}
                  <Button
                    icon='paper-plane'
                    isDisabled={!hasAccounts}
                    label={t('UnStake')}
                    onClick={toggleIsUnStakingOpen}
                  />
                  {isUnStakingOpen && (
                    <StakingModal  toggleOpen={toggleIsUnStakingOpen} hotAddress={info.delegate_ss58} type={'removeStake'} name={'UnStake'}/>
                  )}
                </Button.Group>
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}

export default React.memo(UserInfo);
