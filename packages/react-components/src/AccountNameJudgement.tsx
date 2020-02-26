// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';
import { RegistrarInfo } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { useCall, useApi } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import { useTranslation } from './translate';
import Dropdown from './Dropdown';
import Input from './Input';
import InputAddress from './InputAddress';
import Modal from './Modal';
import TxButton from './TxButton';

interface Props extends BareProps {
  address: string;
  toggleJudgement: () => void;
}

const JUDGEMENT_ENUM = [
  { value: 0, text: 'Unknown' },
  { value: 1, text: 'Fee paid' },
  { value: 2, text: 'Reasonable' },
  { value: 3, text: 'Known good' },
  { value: 4, text: 'Out of date' },
  { value: 5, text: 'Low quality' }
];

export default function AccountNameJudgement ({ address, toggleJudgement }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const registrars = useCall<Option<RegistrarInfo>[]>(api.query.identity?.registrars, []);
  const [judgementAccountId, setJudgementAccountId] = useState<string | null>(null);
  const [judgementEnum, setJudgementEnum] = useState(2); // Reasonable
  const [registrarIndex, setRegistrarIndex] = useState(-1);

  // find the id of our registrar in the list
  useEffect((): void => {
    if (registrars && judgementAccountId) {
      setRegistrarIndex(
        registrars
          .map((registrar): string| null =>
            registrar.isSome
              ? registrar.unwrap().account.toString()
              : null
          )
          .indexOf(judgementAccountId)
      );
    } else {
      setRegistrarIndex(-1);
    }
  }, [judgementAccountId, registrars]);

  return (
    <Modal
      header={t('Provide judgement')}
      size='small'
    >
      <Modal.Content>
        <InputAddress
          label={t('registrar account')}
          onChange={setJudgementAccountId}
        />
        <Input
          isDisabled
          label={t('registrar index')}
          value={registrarIndex === -1 ? t('invalid/unknown registrar account') : registrarIndex}
        />
        <Dropdown
          label={t('judgement')}
          onChange={setJudgementEnum}
          options={JUDGEMENT_ENUM}
          value={judgementEnum}
        />
      </Modal.Content>
      <Modal.Actions onCancel={toggleJudgement}>
        <TxButton
          accountId={judgementAccountId}
          icon='check'
          isDisabled={registrarIndex === -1}
          label={t('Judge')}
          onStart={toggleJudgement}
          params={[registrarIndex, address, judgementEnum]}
          tx='identity.provideJudgement'
        />
      </Modal.Actions>
    </Modal>
  );
}
