// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NominateInfo } from './types';
import { SortedTargets } from '../../types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressMini, InputAddress, InputAddressMulti, Modal, Static, Toggle } from '@polkadot/react-components';
import { useApi, useFavorites } from '@polkadot/react-hooks';

import { MAX_NOMINATIONS, MAX_PAYOUTS, STORE_FAVS_BASE } from '../../constants';
import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId: string;
  next?: string[];
  nominating?: string[];
  onChange: (info: NominateInfo) => void;
  stashId: string;
  targets: SortedTargets;
  validators: string[];
  withSenders?: boolean;
}

interface Selected {
  isAutoSelect: boolean;
  selected: string[];
}

function autoPick (targets: SortedTargets): string[] {
  return (targets.validators || []).reduce((result: string[], { isElected, isFavorite, key, numNominators, rewardPayout }): string[] => {
    if (result.length < MAX_NOMINATIONS) {
      if (numNominators && (numNominators < MAX_PAYOUTS) && (isElected || isFavorite) && !rewardPayout.isZero()) {
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

function Nominate ({ className = '', controllerId, next, nominating, onChange, stashId, targets, validators, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
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
  const [autoSelected, setAutoSelected] = useState<string[]>([]);

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
        ? autoSelected
        : []
    })),
    [autoSelected]
  );

  useEffect((): void => {
    setAutoSelected(
      targets.validators?.length
        ? autoPick(targets)
        : []
    );
  }, [targets]);

  useEffect((): void => {
    onChange({
      nominateTx: selected && selected.length
        ? api.tx.staking.nominate(selected)
        : null
    });
  }, [api, onChange, selected]);

  return (
    <div className={className}>
      {withSenders && (
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={stashId}
              isDisabled
              label={t<string>('stash account')}
            />
            <InputAddress
              defaultValue={controllerId}
              isDisabled
              label={t<string>('controller account')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('The stash that is to be affected. The transaction will be sent from the associated controller account.')}</p>
          </Modal.Column>
        </Modal.Columns>
      )}
      <Modal.Columns>
        <Modal.Column>
          {isAutoSelect
            ? (
              <>
                <Static
                  label={t<string>('auto-selected targets for nomination')}
                  value={
                    selected.map((validatorId) => (
                      <AddressMini
                        className='addressStatic'
                        isHighlight={favorites.includes(validatorId)}
                        key={validatorId}
                        value={validatorId}
                      />
                    ))
                  }
                />
                <article className='warning'>{t<string>('The auto-selection is done on the current profitability of the validators taking your favorites into account. It is adjusted based on the commission and current range of backing for the validator. The calculation may and will change over time, so it is rather a selection based on the current state of the network, not a predictor of future profitability.')}</article>
              </>
            )
            : (
              <InputAddressMulti
                available={available}
                availableLabel={t<string>('candidate accounts')}
                defaultValue={nominating}
                help={t<string>('Filter available candidates based on name, address or short account index.')}
                maxCount={MAX_NOMINATIONS}
                onChange={_setSelected}
                valueLabel={t<string>('nominated accounts')}
              />
            )
          }
          {autoSelected.length !== 0 && (
            <Toggle
              className='auto--toggle'
              isDisabled={!targets.validators?.length}
              label={
                isAutoSelect
                  ? t<string>('Use an automatic selection of the currently most profitable validators')
                  : t<string>('Select targets manually (no auto-selection based on current profitability)')
              }
              onChange={_toggleAutoSelect}
              value={isAutoSelect}
            />
          )}
        </Modal.Column>
        <Modal.Column>
          <p>{t<string>('Nominators can be selected automatically based on the current on-chain conditions or supplied manually as selected from the list of all currently available validators. In both cases, your favorites appear for the selection.')}</p>
          <p>{t<string>('Once transmitted the new selection will only take effect in 2 eras since the selection criteria for the next era was done at the end of the previous era. Until then, the nominations will show as inactive.')}</p>
        </Modal.Column>
      </Modal.Columns>
    </div>
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

  .ui--Static .ui--AddressMini.padded.addressStatic {
    padding-top: 0.5rem;

    .ui--AddressMini-address {
      min-width: 10rem;
      max-width: 10rem;
    }
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
