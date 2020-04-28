// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SortedTargets } from '../../types';

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { AddressMini, InputAddressMulti, InputAddress, Modal, Static, Toggle, TxButton } from '@polkadot/react-components';
import { useFavorites } from '@polkadot/react-hooks';

import { MAX_NOMINATIONS, STORE_FAVS_BASE } from '../../constants';
import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId: string;
  next?: string[];
  nominating?: string[];
  onClose: () => void;
  stashId: string;
  targets: SortedTargets;
  validators: string[];
}

interface Selected {
  isAutoSelect: boolean;
  selected: string[];
}

function Nominate ({ className, controllerId, next, nominating, onClose, stashId, targets, validators }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [favorites] = useFavorites(STORE_FAVS_BASE);
  const [{ isAutoSelect, selected }, setSelected] = useState<Selected>({ isAutoSelect: false, selected: [] });
  const [available] = useState<string[]>((): string[] => {
    const shortlist = [
      // ensure that the favorite is included in the list of stashes
      ...favorites.filter((acc) => (validators || []).includes(acc) || (next || []).includes(acc)),
      // make sure the nominee is not in our favorites already
      ...(nominating || []).filter((acc) => !favorites.includes(acc))
    ];

    return shortlist
      .concat(...(validators || []).filter((acc) => !shortlist.includes(acc)))
      .concat(...(next || []).filter((acc) => !shortlist.includes(acc)));
  });

  const _setSelected = useCallback(
    (selected: string[]) => setSelected(({ isAutoSelect }: Selected) => ({
      isAutoSelect,
      selected
    })),
    []
  );

  const _toggleAutoSelect = useCallback(
    (isAutoSelect: boolean) => setSelected(() => ({
      isAutoSelect,
      selected: isAutoSelect
        ? (targets.validators || []).filter((_, index) => index < MAX_NOMINATIONS).map(({ key }) => key)
        : []
    })),
    [targets]
  );

  return (
    <Modal
      className={`staking--Nominating ${className}`}
      header={t('Nominate Validators')}
    >
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          defaultValue={controllerId}
          isDisabled
          label={t('controller account')}
        />
        <InputAddress
          defaultValue={stashId}
          isDisabled
          label={t('stash account')}
        />
        {isAutoSelect
          ? (
            <Static
              label={t('auto-selected based on the currently most profitable validators')}
              value={
                selected.map((validatorId) => (
                  <AddressMini
                    key={validatorId}
                    value={validatorId}
                  />
                ))
              }
            />
          )
          : (
            <InputAddressMulti
              available={available}
              availableLabel={t('candidate accounts')}
              defaultValue={nominating}
              help={t('Filter available candidates based on name, address or short account index.')}
              maxCount={MAX_NOMINATIONS}
              onChange={_setSelected}
              valueLabel={t('nominated accounts')}
            />
          )
        }
        <Toggle
          className='auto--toggle'
          isDsiabled={!targets.validators?.length}
          label={
            isAutoSelect
              ? t('Use an automatic selection of the currently most profitable validators')
              : t('Select targets manually (no auto-selection based on current profitability)')
          }
          onChange={_toggleAutoSelect}
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={controllerId}
          icon='hand paper outline'
          isDisabled={!selected?.length}
          isPrimary
          label={t('Nominate')}
          onStart={onClose}
          params={[selected]}
          tx='staking.nominate'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Nominate)`
  .auto--toggle {
    margin: 0.5rem 0 0;
    text-align: right;
    width: 100%;
  }

  .ui--Static .ui--AddressMini.padded {
    padding-top: 0.5rem;
  }

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
