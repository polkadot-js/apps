// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressMini, Button, InputAddress, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from '../../constants';
import translate from '../../translate';

interface Props extends I18nProps {
  controllerId: string;
  nominees?: string[];
  onClose: () => void;
  stashId: string;
  stashOptions: KeyringSectionOption[];
}

// We only allow a maximum of 16 nominees, negative to slice
const MAX_NOMINEES = -16;

function Nominate ({ className, controllerId, nominees, onClose, stashId, stashOptions, t }: Props): React.ReactElement<Props> | null {
  const [favorites] = useFavorites(STORE_FAVS_BASE);
  const [next, setNext] = useState<string[] | undefined>();
  const [{ options, shortlist }, setShortlist] = useState<{ options: KeyringSectionOption[]; shortlist: string[] }>({ options: [], shortlist: [] });

  useEffect((): void => {
    if (!next && nominees) {
      setNext(nominees);
    }
  }, [next, nominees]);

  useEffect((): void => {
    if (nominees) {
      const _favorites = favorites.filter((accountId): boolean =>
        stashOptions.some(({ value }): boolean => value === accountId)
      );

      const shortlist = [
        // ensure that the favorite is included in the list of stashes
        ..._favorites,
        // make sure the nominee is not in our favorites already
        ...nominees.filter((accountId): boolean => !_favorites.includes(accountId))
      ];

      setShortlist({
        options: stashOptions.filter(({ value }): boolean => !shortlist.includes(value as string)),
        shortlist
      });
    }
  }, [favorites, nominees, stashOptions]);

  const _onChangeNominees = (_nominees: string[]): void => {
    const newNominees = _nominees.slice(MAX_NOMINEES);

    if (JSON.stringify(newNominees) !== JSON.stringify(nominees)) {
      setNext(newNominees);
    }
  };
  const _onToggleNominee = (nominee: string): void =>
    setNext(
      (next || []).includes(nominee)
        ? (next || []).filter((accountId): boolean => accountId !== nominee)
        : [...(next || []), nominee].slice(MAX_NOMINEES)
    );

  return (
    <Modal
      className={`staking--Nominating ${className}`}
      header={t('Nominate Validators')}
      open
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
        <InputAddress
          className='medium'
          help={t('Stash accounts that are to be nominated. Block rewards are split between validators and nominators. Only 16 nominees will be taken into account.')}
          isInput={false}
          isMultiple
          label={t('nominate the following addresses')}
          onChangeMulti={_onChangeNominees}
          options={options}
          placeholder={t('select accounts(s) nominate')}
          type='account'
          value={next || []}
        />
        {shortlist.length !== 0 && (
          <div className='shortlist'>
            {shortlist.map((address): React.ReactNode => {
              const isAye = next?.includes(address);
              const _onChange = (): void => _onToggleNominee(address);

              return (
                <AddressMini
                  className={`candidate ${isAye ? 'isAye' : 'isNay'}`}
                  key={address}
                  value={address}
                >
                  <div className='candidate-right'>
                    <Toggle
                      label={
                        isAye
                          ? t('Aye')
                          : t('Nay')
                      }
                      onChange={_onChange}
                      value={isAye}
                    />
                  </div>
                </AddressMini>
              );
            })}
          </div>
        )}
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
            isDisabled={!next || next.length === 0}
            isPrimary
            onClick={onClose}
            params={[next]}
            label={t('Nominate')}
            icon='hand paper outline'
            tx='staking.nominate'
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(
  styled(Nominate)`
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
  `
);
