// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';

type Props = BareProps & {
  children?: React.ReactNode
};

const StyledSummary = styled.div`
  align-items: stretch;
  background: rgba(255,255,255,0.65);
  border: 1px solid rgba(0,0,0,0.03);
  border-radius: 4px;
  box-shadow: inset 0px -5px 12px rgba(0,0,0,0.035);
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  margin-bottom: 2.5em;
  overflow-x: scroll;
  padding-right: 1rem;

  &::-webkit-scrollbar {
    height: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #e1e1e1;
  }

  &::-webkit-scrollbar-track {
    background: none;
  }

  > section {
		display: flex;
		flex: 0 1 auto;
		text-align: left;
	}

  > section:first-child > article:first-child .label-small > label {
    min-width: 4rem !important;
  }

	details & {
		display: block;
		margin: 0.5rem 0.25rem;
		opacity: 0.75;
		outline: none;
		overflow: hidden;
		text-align: left;
		text-overflow: ellipsis;
		vertical-align: middle;
		white-space: nowrap;

		+ div {
			margin-top: 0.75rem;
		}
	}

  .ui.label {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
`;

export default class SummaryBox extends React.PureComponent<Props> {
  render () {

    return (
      <StyledSummary>
        {this.props.children}
      </StyledSummary>
    );
  }
}
