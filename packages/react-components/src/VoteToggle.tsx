// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import Toggle from './Toggle';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  onChange: (value: boolean) => void;
  value: boolean;
}

function VoteToggle ({ className = '', onChange, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Toggle
      className={`${className}`}
      label={
        value
          ? t<string>('Aye, I approve')
          : t<string>('Nay, I do not approve')
      }
      onChange={onChange}
      value={value}
    />
  );
}

export default React.memo(styled(VoteToggle)`
  margin: 0.5rem;
  text-align: right;
`);
