// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  value: string;
}

function calcStrength (password: string): number {
  // at least 8 characters
  return (/.{8,}/.test(password) ? 1 : 0) * (
    // bonus if longer
    (/.{12,}/.test(password) ? 1 : 0) +
    // a lower letter
    (/[a-z]/.test(password) ? 1 : 0) +
    // a upper letter
    (/[A-Z]/.test(password) ? 1 : 0) +
    // a digit
    (/\d/.test(password) ? 1 : 0) +
    // a special character
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0)
  );
}

function PasswordStrength ({ className = '', value }: Props): React.ReactElement<Props> {
  // No need for memo, component is already memo-ed (only changes on value)
  const style = { width: `${calcStrength(value) * 20}%` };

  return (
    <div className={className}>
      <div
        className='highlight--bg'
        style={style}
      />
    </div>
  );
}

export default React.memo(styled(PasswordStrength)`
  background: ##eee6e6;
  border-radius: 0.25rem;
  margin-left: 2rem;
  margin-top: 0.25rem;
  overflow: hidden;

  > div {
    height: 0.5rem;
  }
`);
