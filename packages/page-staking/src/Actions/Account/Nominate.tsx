// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { SortedTargets } from '../../types.js';
import type { NominateInfo } from '../partials/types.js';

import React, { useState } from 'react';

import { Modal, styled, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate.js';
import NominatePartial from '../partials/Nominate.js';

interface Props {
  className?: string;
  controllerId: string;
  nominating?: string[];
  onClose: () => void;
  poolId?: BN;
  stashId: string;
  targets: SortedTargets;
}

function Nominate ({ className = '', controllerId, nominating, onClose, poolId, stashId, targets }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [{ nominateTx }, setTx] = useState<NominateInfo>({});

  return (
    <StyledModal
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
          poolId={poolId}
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
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .nominatePartial {
    .ui--Static .ui--AddressMini .ui--AddressMini-info {
      max-width: 10rem;
      min-width: 10rem;
    }
  }
`;

export default React.memo(Nominate);
