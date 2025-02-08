import React, { useRef, useState } from 'react';
import { useTranslation } from '../translate.js';
import { useAccounts, useApi } from '@polkadot/react-hooks';
import { Button, Table, ToggleGroup, TxButton } from '@polkadot/react-components';
import UserInfo from './UserInfo.tsx';
import SubnetPaticpants from './SubnetPaticpants.tsx';
interface Props {
  className?: string;
}

interface ParticipantInfo {
  pos: number;
  subnetName: string;
  participantsName: string;
  yourStake: string;
  yourNominator: string;
  minerStatus: string;
}

function User({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const [typeIndex, setTypeIndex] = useState(0);

  const stashTypes = useRef([
    { text: t('User'), value: 'User' },
    { text: t('Subnet Paticipants'), value: 'Paticipants' },
  ]);

  const renderContent = () => {
    switch (stashTypes.current[typeIndex].value) {
      case 'User':
        return <UserInfo />;
      case 'Paticipants':
        return <SubnetPaticpants />;
      default:
        return null;
    }
  };

  return (
    <div className={`user-dashboard ${className}`}>
      <h1>{t('User Dashboard')}</h1>
      <p>{t('Here displays five different roles for participating in the subnet. You can switch Tabs to view the operations corresponding to each role.')}</p>

      <div className='current-account'>
        <h3>{t('Current Account')}</h3>
        {hasAccounts && allAccounts[0]}
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

      {renderContent()}
    </div>
  );
}

export default React.memo(User);
