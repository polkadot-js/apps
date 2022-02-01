// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedTargets } from '../../types';
import type { NominateInfo } from '../partials/types';

import React, { useState } from 'react';
import styled from 'styled-components';

import { Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import NominatePartial from '../partials/Nominate';

interface Props {
  className?: string;
  controllerId: string;
  nominating?: string[];
  onClose: () => void;
  stashId: string;
  targets: SortedTargets;
}

function Nominate ({ className = '', controllerId, nominating, onClose, stashId, targets }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [{ nominateTx }, setTx] = useState<NominateInfo>({});

  return (
    <Modal
      className={className}
      header={t<string>('Nominate Validators')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <NominatePartial
          className='nominatePartial'
          controllerId={controllerId}
          nominating={nominating}
          onChange={setTx}
          stashId={stashId}
          targets={targets}
          withSenders
        />
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={controllerId}
          extrinsic={nominateTx}
          icon='hand-paper'
          isDisabled={!nominateTx}
          label={t<string>('Nominate')}
          onStart={onClose}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Nominate)`
  .nominatePartial {
    .ui--Static .ui--AddressMini .ui--AddressMini-info {
      max-width: 10rem;
      min-width: 10rem;
    }
  }
`);
