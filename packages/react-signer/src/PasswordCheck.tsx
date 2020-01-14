// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  unlockError?: string | null;
}

function PasswordCheck ({ className, unlockError }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return unlockError
    ? <div className={className}>{t('wrong password')}</div>
    : null;
}

export default styled(PasswordCheck)`
  margin-left: 15em;
  color: #9f3a38;
`;
