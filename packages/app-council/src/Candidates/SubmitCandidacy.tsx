// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { TxSource, TxDef } from '@polkadot/react-hooks/types';
import { ComponentProps } from '../types';

import React from 'react';
import { Button, TxModalNew as TxModal } from '@polkadot/react-components';
import { useApi, useTx } from '@polkadot/react-hooks';

import translate from '../translate';

interface Props extends ComponentProps, I18nProps {}

function SubmitCandidacy ({ t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const txState = useTx(
    (): TxSource<TxDef> => [
      [
        api.query.electionPhragmen ? 'electionPhragmen.submitCandidacy' : 'elections.submitCandidacy',
        [],
      ],
      true
    ],
    []
  );

  return (
    <TxModal
      {...txState}    
      header={t('Submit your council candidacy')}
      inputAddressLabel={t('Candidate account')}
      inputAddressHelp={t('This account will be nominated to fill the council slot you specify.')}
      trigger={
        ({ onOpen }): React.ReactElement => ((
          <Button
            isPrimary
            label={t('Submit candidacy')}
            icon='add'
            onClick={onOpen}
          />
        ))
      }
    />
  );
}

export default translate(SubmitCandidacy);
