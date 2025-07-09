// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ModalProps } from '../types.js';

import FileSaver from 'file-saver';
import React, { useCallback, useState } from 'react';

import { Button, Checkbox, MarkWarning, Modal, styled } from '@polkadot/react-components';
import { keyring } from '@polkadot/ui-keyring';
import { nextTick } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  accountsByGroup: Record<string, string[]>;
  onStatusChange: (status: ActionStatus) => void;
}

function ExportAll ({ accountsByGroup, className, onClose, onStatusChange }: Props): React.ReactElement | null {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

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

          return {
            address: account,
            meta: keyringAccount.meta
          };
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
  }, [accountsByGroup, onClose, onStatusChange, selectedTypes, t]);

  return (
    <Modal
      className={className}
      header={t('export all accounts')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <MarkWarning
          content={t('You can export all your accounts metadata for the selected types')}
          withIcon={false}
        />
        <StyledCheckBoxGroup>
          {Object.keys(accountsByGroup)
            .filter((group) => accountsByGroup[group].length > 0)
            .map((group) => {
              const isSelected = selectedTypes.includes(group);

              return (
                <Checkbox
                  key={group}
                  label={`${group} (${accountsByGroup[group].length})`}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={() => onChangeCheckBox(group)}
                  value={isSelected}
                />
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

const StyledCheckBoxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-inline: 2rem;

  label, .ui--Icon {
    font-size: 1rem;
    font-weight: 500;
  }
`;

export default React.memo(ExportAll);
