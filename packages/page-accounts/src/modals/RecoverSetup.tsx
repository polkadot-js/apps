// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { InputAddress, InputAddressMulti, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { sortAddresses } from '@polkadot/util-crypto';

import useKnownAddresses from '../Accounts/useKnownAddresses.js';
import { useTranslation } from '../translate.js';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
}

const MAX_HELPERS = 16;

function RecoverSetup ({ address, className = '', onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const availableHelpers = useKnownAddresses(address);
  const [delay, setDelay] = useState<BN | undefined>();
  const [helpers, setHelpers] = useState<string[]>([]);
  const [threshold, setThreshold] = useState<BN | undefined>();

  const isErrorDelay = !delay;
  const isErrorHelpers = !helpers.length;
  const isErrorThreshold = !threshold || !threshold.gtn(0) || threshold.gtn(helpers.length);

  return (
    <Modal
      className={className}
      header={t('Setup account as recoverable')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('The recoverable account is protected against the loss of seed/access by a social process.')}>
          <InputAddress
            isDisabled
            label={t('the account to make recoverable')}
            value={address}
          />
        </Modal.Columns>
        <Modal.Columns
          hint={
            <>
              <p>{t('These are trusted individuals that can verify and approve any recovery actions. With recovery, once the threshold is reached, the funds associated with the account can be moved to a new destination.')}</p>
              <p>{t('The helpers should be able to verify, via an off-chain mechanism, that the account owner indeed wishes to recover access and as such provide any approvals. In the cases of malicious recovery procedures, they will have the power to stop it.')}</p>
            </>
          }
        >
          <InputAddressMulti
            available={availableHelpers}
            availableLabel={t('available social recovery helpers')}
            maxCount={MAX_HELPERS}
            onChange={setHelpers}
            valueLabel={t('trusted social recovery helpers')}
          />
        </Modal.Columns>
        <Modal.Columns hint={t('The threshold for approvals and the delay is the protection associated with the account. The delay should be such that any colluding recovery attempts does have a window to stop.')}>
          <InputNumber
            isError={isErrorThreshold}
            label={t('recovery threshold')}
            onChange={setThreshold}
          />
          <InputNumber
            isError={isErrorDelay}
            isZeroable
            label={t('recovery block delay')}
            onChange={setDelay}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={address}
          icon='share-alt'
          isDisabled={isErrorHelpers || isErrorThreshold || isErrorDelay}
          label={t('Make recoverable')}
          onStart={onClose}
          params={[sortAddresses(helpers), threshold, delay]}
          tx={api.tx.recovery.createRecovery}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RecoverSetup);
