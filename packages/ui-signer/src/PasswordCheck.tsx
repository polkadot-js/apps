// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import styled from 'styled-components';

import translate from './translate';

type Props = I18nProps & {
  unlockError?: string | null
};

const Wrapper = styled.div`
    margin-left: 15em;
    color: #9f3a38;
`;

function PasswordCheck (props: Props) {
  const { unlockError, t } = props;

  return unlockError ? <Wrapper>{t('wrong password')}</Wrapper> : null;
}

export default translate(PasswordCheck);
