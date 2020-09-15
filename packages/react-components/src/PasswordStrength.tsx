// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';
import owasp from 'owasp-password-strength-test';

interface Props {
  className?: string;
  value: string;
}

function calcStrength (password: string): number {
  owasp.config({
    allowPassphrases: true,
    maxLength: 128,
    minLength: 8,
    minPhraseLength: 20
  });
  const passedTests = owasp.test(password).passedTests.length;

  return owasp.test(password).isPassphrase ? 6 : passedTests - 2;
}

function PasswordStrength ({ className = '', value }: Props): React.ReactElement<Props> {
  // No need for memo, component is already memo-ed (only changes on value)
  const passwordStrength = calcStrength(value);
  const style = { width: `${passwordStrength * 100 / 6}%` };

  return (
    <div
      className={className}
      style={{ display: passwordStrength ? 'flex' : 'none' }}
    >
      week
      <div className='ui--Strength-bar'>
        <div
          className='ui--Strength-bar-highlighted'
          style={style}
        />
      </div>
      strong
    </div>
  );
}

export default React.memo(styled(PasswordStrength)`
  align-items: center;
  margin-top: 0.5rem;
  font-weight: 800;
  font-size: 10px;
  line-height: 14px;
  text-transform: uppercase;
  color: #8B8B8B;

  .ui--Strength-bar {
    position: relative;
    height: 0.6rem;
    width: 14rem;
    margin: 0 10px;
    border: 1px solid #DFDFDF;
    border-radius: 0.15rem;
    background: #ECECEC;
  }
  .ui--Strength-bar-highlighted {
    position: absolute;
    top: -0.07rem;
    left: -0.07rem;
    height: 0.6rem;
    width: 100%;
    border-radius: 0.15rem;
    background: linear-gradient(90.43deg, #FF8B00 0%, #FFBB50 112.75%);
  }
`);
