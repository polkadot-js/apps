// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';

import React, { useState } from 'react';
import { Button, Columar } from '@polkadot/react-components';

import translate from '../translate';
import Proposals from './Proposals';
import Referendums from './Referendums';
import Summary from './Summary';
import PreImage from './PreImage';

function Overview ({ t }: Props): React.ReactElement {
  const [isPreimageOpen, setIsPreimageOpen] = useState(false);

  const _togglePreimage = (): void => setIsPreimageOpen(!isPreimageOpen);

  return (
    <>
      <Summary />
      <Button.Group>
        <Button
          icon='add'
          isPrimary
          label={t('Note preimage')}
          onClick={_togglePreimage}
        />
      </Button.Group>
      {isPreimageOpen && (
        <PreImage onClose={_togglePreimage} />
      )}
      <Columar>
        <Referendums />
        <Proposals />
      </Columar>
    </>
  );
}

export default translate(Overview);
