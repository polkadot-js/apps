// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Bytes, Option } from '@polkadot/types';
import type { PalletIdentityRegistration } from '@polkadot/types/lookup';
import type { ITuple } from '@polkadot/types/types';
import type { HexString } from '@polkadot/util/types';

import React, { useEffect, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import Dropdown from '../Dropdown.js';
import Input from '../Input.js';
import InputAddress from '../InputAddress/index.js';
import MarkError from '../MarkError.js';
import Modal from '../Modal/index.js';
import Spinner from '../Spinner.js';
import { useTranslation } from '../translate.js';
import TxButton from '../TxButton.js';

interface Props {
  address: string;
  registrars: { address: string; index: number }[];
  toggleJudgement: () => void;
}

const JUDGEMENT_ENUM = [
  { text: 'Unknown', value: 0 },
  { text: 'Fee paid', value: 1 },
  { text: 'Reasonable', value: 2 },
  { text: 'Known good', value: 3 },
  { text: 'Out of date', value: 4 },
  { text: 'Low quality', value: 5 }
];

const OPT_ID = {
  transform: (optId: Option<ITuple<[PalletIdentityRegistration, Option<Bytes>]>>): HexString | null => {
    const id = optId.isSome
      ? optId.unwrap()
      : null;

    // Backwards compatibility - https://github.com/polkadot-js/apps/issues/10493
    return !id
      ? null
      : Array.isArray(id)
        ? id[0].info.hash.toHex()
        : (id as unknown as PalletIdentityRegistration).info.hash.toHex();
  }
};

function RegistrarJudgement ({ address, registrars, toggleJudgement }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { apiIdentity, enableIdentity } = useApi();
  const identityHash = useCall(apiIdentity.query.identity.identityOf, [address], OPT_ID);
  const [addresses] = useState(() => registrars.map(({ address }) => address));
  const [judgementAccountId, setJudgementAccountId] = useState<string | null>(null);
  const [judgementEnum, setJudgementEnum] = useState(2); // Reasonable
  const [registrarIndex, setRegistrarIndex] = useState(-1);

  // find the id of our registrar in the list
  useEffect((): void => {
    const registrar = registrars.find(({ address }) => judgementAccountId === address);

    setRegistrarIndex(
      registrar
        ? registrar.index
        : -1
    );
  }, [judgementAccountId, registrars]);

  return (
    <Modal
      header={t('Provide judgement')}
      onClose={toggleJudgement}
      size='small'
    >
      <Modal.Content>
        <InputAddress
          filter={addresses}
          label={t('registrar account')}
          onChange={setJudgementAccountId}
          type='account'
        />
        <Input
          isDisabled
          label={t('registrar index')}
          value={registrarIndex === -1 ? t('invalid/unknown registrar account') : registrarIndex.toString()}
        />
        <Dropdown
          label={t('judgement')}
          onChange={setJudgementEnum}
          options={JUDGEMENT_ENUM}
          value={judgementEnum}
        />
        {identityHash
          ? (
            <Input
              defaultValue={identityHash}
              isDisabled
              label={t('identity hash')}
            />
          )
          : identityHash === null
            ? <MarkError content={t('No identity associated with account')} />
            : <Spinner noLabel />
        }
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={judgementAccountId}
          icon='check'
          isDisabled={!enableIdentity || !identityHash || registrarIndex === -1}
          label={t('Judge')}
          onStart={toggleJudgement}
          params={
            apiIdentity.tx.identity.provideJudgement.meta.args.length === 4
              ? [registrarIndex, address, judgementEnum, identityHash]
              : [registrarIndex, address, judgementEnum]
          }
          tx={apiIdentity.tx.identity.provideJudgement}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RegistrarJudgement);
