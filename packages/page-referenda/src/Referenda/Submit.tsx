// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RawParam } from '@polkadot/react-params/types';
import type { PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletReferenda } from '../types';

import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import Params from '@polkadot/react-params';
import { Available } from '@polkadot/react-query';
import { getTypeDef } from '@polkadot/types/create';
import { isHex } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  members?: string[];
  onClose: () => void;
  palletReferenda: PalletReferenda;
  tracks: [BN, PalletReferendaTrackInfo][];
}

interface HashState {
  hash?: string;
  isHashValid: boolean;
}

function Submit ({ className = '', members, onClose, palletReferenda }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  // const [track, setTrack] = useState<number | undefined>();
  const [origin, setOrigin] = useState<RawParam['value'] | null>(null);
  const [{ hash, isHashValid }, setHash] = useState<HashState>({ hash: '', isHashValid: false });

  const originType = useMemo(
    () => [{
      type: getTypeDef(api.tx[palletReferenda as 'referenda'].submit.meta.args[0].type.toString())
    }],
    [api, palletReferenda]
  );

  // Idially we would just like to use the track - need a mapping for these
  // const trackOpts = useMemo(
  //   () => tracks.map(([id, track]) => ({
  //     text: track.name.toString(),
  //     value: id.toNumber()
  //   })),
  //   [tracks]
  // );

  const _onChangeOrigin = useCallback(
    ([{ isValid, value }]: RawParam[]) =>
      setOrigin(isValid ? value : null),
    []
  );

  const _onChangeHash = useCallback(
    (hash?: string) =>
      setHash({ hash, isHashValid: isHex(hash, 256) }),
    []
  );

  return (
    <Modal
      className={className}
      header={t<string>('Submit proposal')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('The proposal will be registered from this account and the balance lock will be applied here.')}>
          <InputAddress
            filter={members}
            help={t<string>('The account you want to register the proposal from')}
            label={t<string>('send from account')}
            labelExtra={
              <Available
                label={<span className='label'>{t<string>('transferrable')}</span>}
                params={accountId}
              />
            }
            onChange={setAccountId}
            type='account'
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The hash of the preimage for the proposal as previously submitted or intended.')}>
          <Input
            autoFocus
            help={t<string>('The preimage hash of the proposal')}
            isError={!isHashValid}
            label={t<string>('preimage hash')}
            onChange={_onChangeHash}
            value={hash}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The track you wish to submit for, each has a different period, different root and acceptance criteria.')}>
          {/* <Dropdown
            label={t<string>('submission track')}
            onChange={setTrack}
            options={trackOpts}
          /> */}
          <Params
            className='originSelect'
            onChange={_onChangeOrigin}
            params={originType}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='plus'
          isDisabled={!origin || !isHashValid || !accountId}
          label={t<string>('Submit proposal')}
          onStart={onClose}
          params={[origin, hash]}
          tx={api.tx[palletReferenda as 'referenda'].submit}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Submit)`
  .originSelect {
    > .ui--Params-Content {
      padding-left: 0;
    }
  }
`);
