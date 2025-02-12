import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from '../translate.js';
import { Button, Table, TxButton } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { callXAgereRpc } from '../callXAgereRpc.js';
import StakingModal from './StakingModal.tsx';
import { formatAddress, formatBEVM } from '../utils/formatBEVM.ts';

interface Props {
  className?: string;
  account: string;
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

function UserInfo ({ className, account }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  // const { allAccounts, hasAccounts } = useAccounts();
  const [isStakingOpen, toggleIsStakingOpen] = useToggle();
  const [isUnStakingOpen, toggleIsUnStakingOpen] = useToggle();
  const [isDelegateOpen, toggleIsDelegateOpen] = useToggle();

  const [delegateData, setDelegateData] = useState<DelegateData[]>([]);

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
    callXAgereRpc('xagere_getStakeInfoForColdkey', [account])
      .then(response => {
        console.log('xagere_getStakeInfoForColdkey Response:', response);
      })
      .catch(error => {
        console.error('xagere_getStakeInfoForColdkey calling RPC:', error);
      });
  }, [account]);

  useEffect((): void => {
    callXAgereRpc('xagere_getDelegated', [account])
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
  }, [account]);

  return (
    <div className={className}>
      <div className='delegate-section'>
        <h2>{t('Delegate Your BEVM')}</h2>
        <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <p>{t('Delegate to the registrant you believe is suitable, and you can share a portion of their rewards. Please click the button to proceed with your staking!')}</p>
          <Button
            icon='paper-plane'
            isDisabled={!account}
            label={t('Delegate BEVM')}
            onClick={toggleIsDelegateOpen}
          />
          {isDelegateOpen && (
            <StakingModal modelName={'Stake'} toggleOpen={toggleIsDelegateOpen} hotAddress={account} type={'addStake'} name={'Stake'}/>
          )}
        </div>
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
                    isDisabled={!account}
                    label={t('Stake')}
                    onClick={toggleIsStakingOpen}
                  />
                  {isStakingOpen && (
                    <StakingModal modelName={'Stake'} toggleOpen={toggleIsStakingOpen} hotAddress={info.delegate_ss58} type={'addStake'} name={'Stake'}/>
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
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}

export default React.memo(UserInfo);
