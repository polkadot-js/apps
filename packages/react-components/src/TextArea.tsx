// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled, { css } from 'styled-components';

interface Props {
  withError?: boolean;
}

const TextInput = css(({ withError }: Props) => `
  background: #FAFAFA;
  border-color: ${withError ? '#E42F2F' : '#DDE1EB'};
  border-radius: 4px;
  border: 1px solid #DDE1EB;
  box-sizing: border-box;
  color: ${withError ? '#E42F2F' : '#242529'};
  display: block;
  font-family: Nunito, sans-serif;
  font-size: 16px;
  outline: none;
  padding: 0.5rem 0.75rem;
  resize: none;
  width: 100%;

  &:read-only {
    background: '#1A1B20';
    box-shadow: none;
    outline: none;
  }
`);

export const TextArea = styled.textarea<Props>`${TextInput}`;
export const Input = styled.input<Props>`${TextInput}`;
