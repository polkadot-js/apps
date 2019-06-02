// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';
import { Icon } from '@polkadot/ui-app';

type Props = {
  children: React.ReactNode,
  className?: string,
  icon: string
};

type State = {
  isHidden: boolean
};

class BaseOverlay extends React.PureComponent<Props, State> {
  state: State = {
    isHidden: false
  };

  render () {
    const { children, className, icon } = this.props;
    const { isHidden } = this.state;

    if (isHidden) {
      return null;
    }

    return (
      <div className={className}>
        <div className='content'>
          <Icon
            className='contentIcon'
            name={icon as any}
            size='big'
          />
          <div className='contentItem'>
            {children}
          </div>
          <Icon
            className='closeIcon'
            name='close'
            onClick={this.onClose}
          />
        </div>
      </div>
    );
  }

  private onClose = () => {
    this.setState({ isHidden: true });
  }
}

export default styled(BaseOverlay)`
  border-bottom: 1px solid transparent;
  left: 0;
  line-height: 1.5em;
  padding: 0 2rem;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 500;

  .content {
    display: flex;
    margin: 0 auto;
    max-width: 50rem;
    padding: 1em 2rem;
    position: relative;

    .contentIcon {
      flex: 0;
    }

    .contentItem {
      flex: 1;
      padding: 0 1rem;

      > div+div {
        margin-top: 0.5rem;
      }
    }
  }

  .closeIcon {
    cursor: pointer;
    position: absolute;
    right: 0.75em;
    top: 0.75em;
  }
`;
