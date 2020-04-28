// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SortedTargets } from '../../types';

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { AddressMini, InputAddressMulti, InputAddress, Modal, Static, Toggle, TxButton } from '@polkadot/react-components';
import { useFavorites } from '@polkadot/react-hooks';

import { MAX_NOMINATIONS, MAX_PAYOUTS, STORE_FAVS_BASE } from '../../constants';
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

function autoPick (targets: SortedTargets): string[] {
  return (targets.validators || []).reduce((result: string[], { key, numNominators }): string[] => {
    if (result.length < MAX_NOMINATIONS) {
      if (numNominators && (numNominators < MAX_PAYOUTS)) {
        result.push(key);
      }
    }

    return result;
  }, []);
}

function initialPick (targets: SortedTargets): Selected {
  const selected = targets.validators?.length
    ? autoPick(targets)
    : [];

  return {
    isAutoSelect: selected.length !== 0,
    selected
  };
}

function Nominate ({ className, controllerId, next, nominating, onClose, stashId, targets, validators }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [favorites] = useFavorites(STORE_FAVS_BASE);
  const [{ isAutoSelect, selected }, setSelected] = useState<Selected>(initialPick(targets));
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
        ? autoPick(targets)
        : []
    })),
    [targets]
  );

  return (
    <Modal
      className={`staking--Nominating ${className}`}
      header={t('Nominate Validators')}
      size='large'
    >
      <Modal.Content className='ui--signer-Signer-Content'>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={stashId}
              isDisabled
              label={t('stash account')}
            />
            <InputAddress
              defaultValue={controllerId}
              isDisabled
              label={t('controller account')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('The stash that is to be affected. The transaction will be sent from the associated controller account.')}</p>
          </Modal.Column>
        </Modal.Columns>
        <Modal.Columns>
          <Modal.Column>
            {isAutoSelect
              ? (
                <>
                  <Static
                    label={t('auto-selected targets for nomination')}
                    value={
                      selected.map((validatorId) => (
                        <AddressMini
                          key={validatorId}
                          value={validatorId}
                        />
                      ))
                    }
                  />
                  <article className='warning'>{t('The auto-selection is done on the current profitability of the validators taking your favorites into account. It is adjusted based on the commission and current range of backing for the validator. The calculation may and will change over time, so it is rather a selection based on the current state of the network, not a predictor of future profitability.')}</article>
                </>
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
              isDisabled={!targets.validators?.length}
              label={
                isAutoSelect
                  ? t('Use an automatic selection of the currently most profitable validators')
                  : t('Select targets manually (no auto-selection based on current profitability)')
              }
              onChange={_toggleAutoSelect}
              value={isAutoSelect}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t('Nominators can be selected automatically based on the current on-chain conditions or supplied manually as selected from the list of all currently available validators. In both cases, your favorites appear for the selection.')}</p>
            <p>{t('Once transmitted the new selection will only take effect in 2 eras since the selection criteria for the next era was done at the end of the previous era. Until then, the nominations will show as inactive.')}</p>
          </Modal.Column>
        </Modal.Columns>
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
  article.warning {
    margin-top: 0;
  }

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
