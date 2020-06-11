// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputAddress, Modal } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onChange: (address: string) => void;
  requestAddress: string;
}

function AddressOrProxy ({ className, onChange, requestAddress }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [address] = useState(requestAddress);

  useEffect((): void => {
    onChange(address);
  }, [address, onChange]);

  return (
    <Modal.Columns className={className}>
      <Modal.Column>
        <InputAddress
          className='full'
          defaultValue={address}
          isDisabled
          isInput
          label={t('sending from my account')}
          withLabel
        />
      </Modal.Column>
      <Modal.Column>
        <p>{t('The sending account that will be used to send this transaction. Any applicable fees will be paid by this account.')}</p>
      </Modal.Column>
    </Modal.Columns>
  );
}

export default React.memo(styled(AddressOrProxy)``);
