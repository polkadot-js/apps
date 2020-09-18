// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { NominateInfo } from './types';
import { SortedTargets } from '../../types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputAddress, InputAddressMulti, Modal } from '@polkadot/react-components';
import { useApi, useFavorites } from '@polkadot/react-hooks';

import { MAX_NOMINATIONS, STORE_FAVS_BASE } from '../../constants';
import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId: string;
  nominating?: string[];
  onChange: (info: NominateInfo) => void;
  stashId: string;
  targets: SortedTargets;
  withSenders?: boolean;
}

function Nominate ({ className = '', controllerId, nominating, onChange, stashId, targets: { validatorIds = [] }, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [favorites] = useFavorites(STORE_FAVS_BASE);
  const [selected, setSelected] = useState<string[]>(nominating || []);
  const [available] = useState<string[]>((): string[] => {
    const shortlist = [
      // ensure that the favorite is included in the list of stashes
      ...favorites.filter((acc) => validatorIds.includes(acc)),
      // make sure the nominee is not in our favorites already
      ...(nominating || []).filter((acc) => !favorites.includes(acc))
    ];

    return shortlist
      .concat(...(validatorIds.filter((acc) => !shortlist.includes(acc))));
  });

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
          <InputAddressMulti
            available={available}
            availableLabel={t<string>('candidate accounts')}
            defaultValue={nominating}
            help={t<string>('Filter available candidates based on name, address or short account index.')}
            maxCount={MAX_NOMINATIONS}
            onChange={setSelected}
            valueLabel={t<string>('nominated accounts')}
          />
          <article className='warning'>{t<string>('You should trust your nominations to act competently and honest; basing your decision purely on their current profitability could lead to reduced profits or even loss of funds.')}</article>
        </Modal.Column>
        <Modal.Column>
          <p>{t<string>('Nominators can be selected manually from the list of all currently available validators.')}</p>
          <p>{t<string>('Once transmitted the new selection will only take effect in 2 eras taking the new validator election cycle into account. Until then, the nominations will show as inactive.')}</p>
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

    .ui--AddressMini-info {
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
