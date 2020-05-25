// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachainInfo } from '@polkadot/api-derive/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

import React, { useMemo, useRef } from 'react';
import { useApi } from '@polkadot/react-hooks';

import { Modal, Static, TxButton } from '@polkadot/react-components';
import ParachainInfo from '../ParachainInfo';

import { useTranslation } from '../translate';

interface Props {
  id: string;
  onClick?: () => void;
  info: DeriveParachainInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  sudoKey: string;
}

function Deregister ({ id, info, isOpen, onClose, onSubmit, sudoKey }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const onSendRef = useRef<() => void>();

  const extrinsic = useMemo(
    (): SubmittableExtrinsic | null => {
      try {
        return api.tx.registrar.deregisterPara(id);
      } catch (error) {
        console.log(error);

        return null;
      }
    },
    [api, id]
  );

  const onStart = (): void => {
    onClose();
    onSubmit();
  };

  return (
    <Modal
      header={t<string>('Deregister this parachain')}
      onClose={onClose}
      open={isOpen}
      small
    >
      <Modal.Content>
        <ParachainInfo info={info} />
        <br />
        <br />
        <Static
          className='full label-small'
          help={t<string>('The id of the parachain to be deregistered.')}
          label={t<string>('parachain id')}
          value={id}
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={sudoKey}
          isDisabled={!id || !extrinsic}
          onClick={onClose}
          onSendRef={onSendRef}
          onStart={onStart}
          params={[extrinsic]}
          tx={'sudo.sudo'}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Deregister);
