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
  background: #fff;
  box-shadow: 0px 5px 15px rgba(0,0,0,0.08);
  display: flex;
  flex-wrap: no-wrap;
  justify-content: space-between;
  margin-bottom: 2.5em;
  overflow-x: scroll;
  padding-right: 1rem;

  &::-webkit-scrollbar {
     display: none;
     width: 0px;
   }

   > section {
		display: flex;
		flex: 0 1 auto;
		text-align: left;
	}

	article {
		box-shadow: none;
		color: rgba(0, 0, 0, 0.6);
		flex: 0 1 auto;
		text-align: left;
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
  `;

export default class SummaryBox extends React.PureComponent<Props> {
  render () {
    return (
      <StyledSummary className='ui--summary'>
        {this.props.children}
      </StyledSummary>
    );
  }
}
