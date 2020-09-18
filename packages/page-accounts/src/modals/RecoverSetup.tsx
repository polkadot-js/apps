// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React, { useState } from 'react';
import { InputAddressMulti, InputAddress, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { sortAddresses } from '@polkadot/util-crypto';

import { useTranslation } from '../translate';
import useKnownAddresses from '../Accounts/useKnownAddresses';

interface Props {
  address: string;
  className?: string;
  onClose: () => void;
}

const MAX_HELPERS = 16;

function RecoverSetup ({ address, className = '', onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
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
      header={t<string>('Setup account as recoverable')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              isDisabled
              label={t<string>('the account to make recoverable')}
              value={address}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The recoverable account is protected against the loss of seed/access by a social process.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputAddressMulti
              available={availableHelpers}
              availableLabel={t<string>('available social recovery helpers')}
              help={t<string>('The addresses that are able to help in recovery. You can select up to {{maxHelpers}} trusted helpers.', { replace: { maxHelpers: MAX_HELPERS } })}
              maxCount={MAX_HELPERS}
              onChange={setHelpers}
              value={helpers}
              valueLabel={t<string>('trusted social recovery helpers')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('These are trusted individuals that can verify and approve any recovery actions. With recovery, once the threshold is reached, the funds associated with the account can be moved to a new destination.')}</p>
            <p>{t<string>('The helpers should be able to verify, via an off-chain mechanism, that the account owner indeed wishes to recover access and as such provide any approvals. In the cases of malicious recovery procedures, they will have the power to stop it.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            <InputNumber
              help={t<string>('The threshold of vouches that is to be reached for the account to be recovered.')}
              isError={isErrorThreshold}
              label={t<string>('recovery threshold')}
              onChange={setThreshold}
            />
            <InputNumber
              help={t<string>('The delay between vouching and the availability of the recovered account.')}
              isError={isErrorDelay}
              isZeroable
              label={t<string>('recovery block delay')}
              onChange={setDelay}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The threshold for approvals and the delay is the protection associated with the account. The delay should be such that any colluding recovery attempts does have a window to stop.')}</p>
          </Modal.Column>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={address}
          icon='share-alt'
          isDisabled={isErrorHelpers || isErrorThreshold || isErrorDelay}
          label={t<string>('Make recoverable')}
          onStart={onClose}
          params={[sortAddresses(helpers), threshold, delay]}
          tx='recovery.createRecovery'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RecoverSetup);
