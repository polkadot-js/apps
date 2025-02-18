import { Button } from "@polkadot/react-components";
import { useTranslation } from '../translate.js';

import React from 'react';
import { useToggle } from '@polkadot/react-hooks';
import DelegateeModal from "./DelegateeModal.tsx";

interface Props {
  className?: string;
  account: string;
  onSuccess: () => void;
}


function DelegateeInfo({ className, account, onSuccess }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isDelegateeOpen, toggleIsDelegateeOpen] = useToggle();

  return (
    <>
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
      }}>{t('Register as a Delegatee')}</h2>

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
        }}>{t('Before becoming a delegatee, you need to complete one more step of registration, which will allow you to receive staking from community users.')}</p>
        <Button
          icon='plus'
          label={t('Delegatee')}
          onClick={toggleIsDelegateeOpen}
        />
      </div>
    </div>
      {isDelegateeOpen && (
        <DelegateeModal
          account={account}
          toggleOpen={toggleIsDelegateeOpen   }
          onSuccess={onSuccess}
        />
      )}
    </>

  );
}

export default React.memo(DelegateeInfo);