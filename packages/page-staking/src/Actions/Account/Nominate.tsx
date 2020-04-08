// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputAddressMulti, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from '../../constants';
import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId: string;
  isOpen: boolean;
  next?: string[];
  nominees?: string[];
  onClose: () => void;
  stashId: string;
  validators: string[];
}

const MAX_NOMINEES = 16;

function Nominate ({ className, controllerId, isOpen, next, nominees, onClose, stashId, validators }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [favorites] = useFavorites(STORE_FAVS_BASE);
  const [selection, setSelection] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);

  useEffect((): void => {
    const shortlist = [
      // ensure that the favorite is included in the list of stashes
      ...favorites.filter((acc) => (validators || []).includes(acc) || (next || []).includes(acc)),
      // make sure the nominee is not in our favorites already
      ...(nominees || []).filter((acc) => !favorites.includes(acc))
    ];

    setAvailable([
      ...shortlist,
      ...(validators || []).filter((acc) => !shortlist.includes(acc)),
      ...(next || []).filter((acc) => !shortlist.includes(acc))
    ]);
  }, [favorites, next, nominees, validators]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      className={`staking--Nominating ${className}`}
      header={t('Nominate Validators')}
    >
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
        <InputAddressMulti
          available={available}
          availableLabel={t('candidate accounts')}
          className='medium'
          defaultValue={nominees}
          help={t('Filter available candidates based on name, address or short account index.')}
          maxCount={MAX_NOMINEES}
          onChange={setSelection}
          valueLabel={t('nominated accounts')}
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          icon='hand paper outline'
          isDisabled={!selection?.length}
          isPrimary
          label={t('Nominate')}
          onStart={onClose}
          params={[selection]}
          tx='staking.nominate'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Nominate)`
  .shortlist {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .candidate {
      border: 1px solid #eee;
      border-radius: 0.25rem;
      margin: 0.25rem;
      padding-bottom: 0.25rem;
      padding-right: 0.5rem;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        border-color: transparent;
        border-style: solid;
        border-radius: 0.25em;
        border-width: 0.25em;
      }

      &.isAye {
        background: #fff;
        border-color: #ccc;
      }

      &.member::after {
        border-color: green;
      }

      &.runnerup::after {
        border-color: steelblue;
      }

      .ui--AddressMini-icon {
        z-index: 1;
      }

      .candidate-right {
        text-align: right;
      }
    }
  }
`);
