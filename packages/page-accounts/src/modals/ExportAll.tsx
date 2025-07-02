// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ModalProps } from '../types.js';

import FileSaver from 'file-saver';
import React, { useCallback, useState } from 'react';

import { AddressRow, Button, Checkbox, MarkWarning, Modal, Password, styled } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';
import { nextTick } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  accountsByGroup: Record<string, string[]>;
  onStatusChange: (status: ActionStatus) => void;
}

interface TPassword {
  account: string, isPassTouched: boolean, password: string
}

const ALLOWED_CATEGORIES = ['accounts', 'multisig', 'qr'];

function ExportAll ({ accountsByGroup, className, onClose, onStatusChange }: Props): React.ReactElement | null {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [allBrowserAccountPassword, setAllBrowserAccountPassword] = useState<TPassword[]>([]);

  // toggle checkboxes
  const onChangeCheckBox = useCallback((group: string) => {
    if (!selectedTypes.includes(group)) {
      setSelectedTypes([...selectedTypes, group]);
    } else {
      setSelectedTypes(selectedTypes.filter((prev) => prev !== group));
    }
  }, [selectedTypes]);

  const _onExportButtonClick = useCallback(() => {
    setIsBusy(true);

    nextTick((): void => {
      const status: Partial<ActionStatus> = { action: 'export' };

      try {
        let allAccounts: string[] = [];

        // get all accounts for selected groups
        selectedTypes.forEach((group) => {
          allAccounts = [...allAccounts, ...accountsByGroup[group]];
        });

        const accounts = allAccounts.map((account) => {
          const keyringAccount = keyring.getPair(account);

          // Handle In-Browser Accounts explicitly
          if (accountsByGroup.accounts.includes(account)) {
            return keyring.backupAccount(keyringAccount, allBrowserAccountPassword.find((a) => a.account === account)?.password || '');
          } else {
            return keyringAccount;
          }
        });

        const blob = new Blob([JSON.stringify(accounts, null, 2)], { type: 'application/json; charset=utf-8' });

        // eslint-disable-next-line deprecation/deprecation
        FileSaver.saveAs(blob, `batch_exported_accounts_${new Date().getTime()}.json`);

        status.status = 'success';
        status.message = t('accounts exported');
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
        console.error(error);
      }

      setIsBusy(false);
      onStatusChange(status as ActionStatus);

      if (status.status !== 'error') {
        onClose();
      }
    });
  }, [accountsByGroup, allBrowserAccountPassword, onClose, onStatusChange, selectedTypes, t]);

  return (
    <Modal
      className={className}
      header={t('export all accounts')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <MarkWarning
          content={t('You can batch export accounts, but only for in-browser, QR, and multisig types.')}
          withIcon={false}
        />
        <StyledCheckBoxGroup>
          {Object.keys(accountsByGroup)
            .filter((group) => ALLOWED_CATEGORIES.includes(group) && accountsByGroup[group].length > 0)
            .map((group) => {
              const isSelected = selectedTypes.includes(group);

              return (
                <section key={group}>
                  <Checkbox
                    label={`${group === 'accounts' ? 'in-browser' : group} accounts (${accountsByGroup[group].length})`}
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange={() => onChangeCheckBox(group)}
                    value={isSelected}
                  />
                  {group === 'accounts' && isSelected &&
                  <BrowserAccounts
                    accounts={accountsByGroup[group]}
                    allPassword={allBrowserAccountPassword}
                    setAllPassword={setAllBrowserAccountPassword}
                  />}
                </section>
              );
            })}
        </StyledCheckBoxGroup>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='sync'
          isBusy={isBusy}
          isDisabled={!selectedTypes.length}
          label={t('Export')}
          onClick={_onExportButtonClick}
        />
      </Modal.Actions>
    </Modal>
  );
}

const BrowserAccounts = ({ accounts, allPassword, setAllPassword }: {accounts: string[], allPassword: TPassword[], setAllPassword: React.Dispatch<React.SetStateAction<TPassword[]>>}) => {
  const { t } = useTranslation();

  const _onChangePass = useCallback(
    (account: string, password: string): void => {
      setAllPassword((prev) => {
        return [
          ...prev.filter((e) => e.account !== account),
          { account, isPassTouched: true, password }
        ];
      });
    },
    [setAllPassword]
  );

  return accounts.map((account) => {
    const { isPassTouched, password } = allPassword.find((a) => a.account === account) || { isPassTouched: false, password: '' };
    const isPassValid = keyring.isPassValid(password);

    return <BrowserAccountsDiv key={account}>
      <AddressRow
        isInline
        value={account}
      />
      <Password
        autoFocus
        isError={isPassTouched && !isPassValid}
        label={t('password')}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={(password) => _onChangePass(account, password)}
        value={password}
      />
    </BrowserAccountsDiv>;
  });
};

const StyledCheckBoxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
  padding-inline: 2rem;

  label, .ui--Icon {
    font-size: 1rem;
    font-weight: 500;
  }

  section > div > label {
    text-transform: capitalize;
  }
`;

const BrowserAccountsDiv = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-inline: 2rem;

  div:nth-child(2) { 
    width: 100%;
    label { 
      font-size: var(--font-size-label);
    }
  }  
`;

export default React.memo(ExportAll);
