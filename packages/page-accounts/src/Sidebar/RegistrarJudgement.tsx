// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';
import { Dropdown, Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../translate';

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

function RegistrarJudgement ({ address, registrars, toggleJudgement }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [addresses] = useState(registrars.map(({ address }) => address));
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
      header={t<string>('Provide judgement')}
      onClose={toggleJudgement}
      size='small'
    >
      <Modal.Content>
        <InputAddress
          filter={addresses}
          label={t<string>('registrar account')}
          onChange={setJudgementAccountId}
          type='account'
        />
        <Input
          isDisabled
          label={t<string>('registrar index')}
          value={registrarIndex === -1 ? t<string>('invalid/unknown registrar account') : registrarIndex.toString()}
        />
        <Dropdown
          label={t<string>('judgement')}
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
          label={t<string>('Judge')}
          onStart={toggleJudgement}
          params={[registrarIndex, address, judgementEnum]}
          tx='identity.provideJudgement'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RegistrarJudgement);
