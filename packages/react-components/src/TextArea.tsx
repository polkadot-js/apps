// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
  font-size: 16px;
  outline: none;
  padding: 1.75rem 3rem 0.75rem 1.5rem;
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
