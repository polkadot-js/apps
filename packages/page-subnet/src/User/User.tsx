import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from '../translate.js';
import { Button, Table, ToggleGroup, TxButton } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import UserInfo from './UserInfo.tsx';
import SubnetPaticpants from './SubnetPaticpants.tsx';
import AccountSelector from './AccountSelector.tsx';

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
    <div className={`${className}`}>
      <h3>{'User Dashboard'}</h3>
      <p>{t('Here displays five different roles for participating in the subnet. You can switch Tabs to view the operations corresponding to each role.')}</p>

      <div className='current-account' style={{display:'flex', justifyItems:'center', flexDirection:'row', alignItems:'center'}}>
        <h3>{t('Current Account')}</h3>
        <div className='account-section'>
          <AccountSelector
            onChange={(address) => setSelectedAccount(address)}
            selectedAddress={selectedAccount}
          />
        </div>
      </div>

      <div className='tabs'>
        <Button.Group>
          <ToggleGroup
            onChange={setTypeIndex}
            options={stashTypes.current}
            value={typeIndex}
          />
        </Button.Group>
      </div>
      <div style={{ background:'white', padding:'12px'}}>
        {renderContent()}
      </div>
    </div>
  );
}

export default React.memo(User);
