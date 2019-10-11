// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

import React, { useState } from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';

import translate from '../../translate';

interface Props extends I18nProps {
  controllerId: string;
  isOpen: boolean;
  nominees?: string[];
  onClose: () => void;
  stashId: string;
  stashOptions: KeyringSectionOption[];
}

// We only allow a maximum of 16 nominees, negative to slice
const MAX_NOMINEES = -16;

function Nominate ({ controllerId, isOpen, onClose, stashId, stashOptions, t }: Props): React.ReactElement<Props> | null {
  const [nominees, setNominees] = useState<string[]>([]);

  if (!isOpen) {
    return null;
  }

  const _onChangeNominees = (_nominees: string[]): void => {
    const newNominees = _nominees.slice(MAX_NOMINEES);

    if (JSON.stringify(newNominees) !== JSON.stringify(nominees)) {
      setNominees(newNominees);
    }
  };

  return (
    <Modal
      className='staking--Nominating'
      dimmer='inverted'
      open
      size='small'
    >
      <Modal.Header>
        {t('Nominate Validators')}
      </Modal.Header>
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          defaultValue={controllerId}
          isDisabled
          label={t('controller account')}
        />
        <InputAddress
          className='medium'
          defaultValue={stashId}
          isDisabled
          label={t('stash account')}
        />
        <InputAddress
          className='medium'
          help={t('Stash accounts that are to be nominated. Block rewards are split between validators and nominators. Only 16 nominees will be taken into account.')}
          isInput={false}
          isMultiple
          label={t('nominate the following addresses')}
          onChangeMulti={_onChangeNominees}
          options={stashOptions}
          placeholder={t('select accounts(s) nominate')}
          type='account'
          value={nominees}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            label={t('Cancel')}
            icon='cancel'
          />
          <Button.Or />
          <TxButton
            accountId={controllerId}
            isDisabled={nominees.length === 0}
            isPrimary
            onClick={onClose}
            params={[nominees]}
            label={t('Nominate')}
            icon='hand paper outline'
            tx='staking.nominate'
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(Nominate);
