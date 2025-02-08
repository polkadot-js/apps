import React, { useState } from 'react';
import { useTranslation } from '../translate.js';
import { Button, Table, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi } from '@polkadot/react-hooks';

interface Props {
  className?: string;
}

function SubnetPaticpants ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [participants, setParticipants] = useState<ParticipantInfo[]>([]);
  const { allAccounts, hasAccounts } = useAccounts();

  const header = [
    [t('POS'), 'start'],
    [t('Subnet Name'), 'start'],
    [t('Participants name'), 'start'],
    [t('Your Stake'), 'start'],
    [t('Your Nominator'), 'start'],
    [t('Miner Status'), 'start'],
    [t('Operation'), 'start']
  ];
  return (
    <div className={className}>
      <div className='register-section'>
        <div className='register-header'>
          <h2>{t('Register as a Subnet Paticipants')}</h2>
          <TxButton
            accountId={hasAccounts ? allAccounts[0] : ''}
            icon='plus'
            label={t('Register')}
            onStart={() => {}}
            params={['1', allAccounts[0]]}
            tx={api.tx['xAgere'].burnedRegister}
          />
        </div>
        <p>{t('Register as a validator/miner for any subnet, safeguard specific mainnets, and share in BEVM rewards.')}</p>
      </div>

      <div className='status-section'>
        <h2>{t('Your Subnet Participants Status')}</h2>
        <Table
          empty={t('No participants found')}
          header={header}
        >
          {participants.map((p) => (
            <tr key={p.pos}>
              <td>{p.pos}</td>
              <td>{p.subnetName}</td>
              <td>{p.participantsName}</td>
              <td>{p.yourStake}</td>
              <td>{p.yourNominator}</td>
              <td>{p.minerStatus}</td>
              <td>
                <Button.Group>
                  <TxButton
                    accountId={hasAccounts ? allAccounts[0] : ''}
                    icon='cog'
                    label={t('Setting')}
                    onStart={() => {}}
                    params={[p.pos]}
                    tx={api.tx['xAgere'].updateSettings}
                  />
                  <TxButton
                    accountId={hasAccounts ? allAccounts[0] : ''}
                    icon='plus'
                    label={t('Stake')}
                    onStart={() => {}}
                    params={[p.pos]}
                    tx={api.tx['xAgere'].addStake}
                  />
                  <TxButton
                    accountId={hasAccounts ? allAccounts[0] : ''}
                    icon='minus'
                    label={t('Unstake')}
                    onStart={() => {}}
                    params={[p.pos]}
                    tx={api.tx['xAgere'].removeStake}
                  />
                </Button.Group>
              </td>
            </tr>
          ))}
        </Table>
      </div>

      <div className='qa-section'>
        <h2>{t('Subnet Miner Registration Q&A')}</h2>
        {/* Q&A 部分可以使用折叠面板组件 */}
      </div>
    </div>
  );
}

export default React.memo(SubnetPaticpants);
