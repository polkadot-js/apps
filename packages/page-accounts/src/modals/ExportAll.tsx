// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ModalProps } from '../types.js';

import FileSaver from 'file-saver';
import React, { useCallback, useState } from 'react';

import { Button, MarkWarning, Modal } from '@polkadot/react-components';
import { useAccounts } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { nextTick } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  accountsByGroup: Record<string, React.ReactNode[]>;
  onStatusChange: (status: ActionStatus) => void;
}

function ExportAll ({ accountsByGroup, className, onClose, onStatusChange }: Props): React.ReactElement | null {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const [isBusy, setIsBusy] = useState(false);

  const _onExportButtonClick = useCallback(() => {
    setIsBusy(true);

    nextTick((): void => {
      const status: Partial<ActionStatus> = { action: 'export' };

      try {
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
  }, [allAccounts, onClose, onStatusChange, t]);

  return (
    <Modal
      className={className}
      header={t('export all accounts')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <MarkWarning content={<>{t('Consider storing your account in a signer such as a browser extension, hardware device, QR-capable phone wallet (non-connected) or desktop application for optimal account security.')}&nbsp;{t('Future versions of the web-only interface will drop support for non-external accounts, much like the IPFS version.')}</>} />
        <Modal.Columns hint={t('Choose type of accounts you want to export')}>
          <div>
            {Object.keys(accountsByGroup).map((group) => <p key={group}>{group}</p>)}
          </div>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='sync'
          isBusy={isBusy}
          label={t('Export')}
          onClick={_onExportButtonClick}
        />
      </Modal.Actions>
    </Modal>

  );
}

export default React.memo(ExportAll);
