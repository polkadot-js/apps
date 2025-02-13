import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from '../translate.js';
import { AddressSmall, Button, InputAddress, ToggleGroup } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import UserInfo from './UserInfo.tsx';
import SubnetPaticpants from './SubnetPaticpants.tsx';

interface Props {
  className?: string;
}

function User({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [typeIndex, setTypeIndex] = useState(0);
  const { allAccounts, hasAccounts } = useAccounts()
  const [selectedAccount, setSelectedAccount] = useState<string>(hasAccounts ? allAccounts[0] : '');

  const stashTypes = useRef([
    { text: t('User'), value: 'User' },
    { text: t('Subnet Paticipants'), value: 'Paticipants' },
  ]);

  const renderContent = () => {
    switch (stashTypes.current[typeIndex].value) {
      case 'User':
        return <UserInfo account={selectedAccount} />;
      case 'Paticipants':
        return <SubnetPaticpants account={selectedAccount} />;
      default:
        return null;
    }
  };

  return (
    <div className={`${className}`} style={{ padding: '1rem' }}>
      <h3 style={{
        fontSize: '24px',
        fontWeight: 'normal',
        marginBottom: '0.5rem'
      }}>{'User Dashboard'}</h3>

      <p style={{
        color: 'var(--color-text-light)',
        marginBottom: '2rem'
      }}>{t('Here displays five different roles for participating in the subnet. You can switch Tabs to view the operations corresponding to each role.')}</p>

      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '0.25rem',
        marginBottom: '1rem'
      }}>
        <h3 style={{
          fontSize: '16px',
          marginBottom: '1rem',
          color: 'var(--color-text)'
        }}>{t('Current Account')}</h3>

        <InputAddress
          defaultValue={hasAccounts ? allAccounts[0] : ''}
          label={t('accountId: AccountId')}
          labelExtra={
            <span style={{
              color: 'var(--color-text-light)',
              fontSize: '14px'
            }}>CHAINX_HUIZI (EXTENSION)</span>
          }
          onChange={(value: string | null) => setSelectedAccount(value || '')}
          type='account'
          withLabel
        />
      </div>

      <div className='tabs' style={{ marginBottom: '1rem' }}>
        <Button.Group>
          <ToggleGroup
            onChange={setTypeIndex}
            options={stashTypes.current}
            value={typeIndex}
          />
        </Button.Group>
      </div>
      {renderContent()}
    </div>
  );
}

export default React.memo(User);
