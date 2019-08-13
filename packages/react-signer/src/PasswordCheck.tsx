// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { withMulti } from '@polkadot/react-api';

import translate from './translate';

interface Props extends I18nProps {
  className?: string;
  unlockError?: string | null;
}

function PasswordCheck (props: Props): React.ReactElement<Props> | null {
  const { className, unlockError, t } = props;

  return unlockError
    ? <div className={className}>{t('wrong password')}</div>
    : null;
}

export default withMulti(
  styled(PasswordCheck)`
    margin-left: 15em;
    color: #9f3a38;
  `,
  translate
);
