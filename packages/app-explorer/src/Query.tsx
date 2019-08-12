// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { Button, FilterOverlay, Input, TxComponent } from '@polkadot/react-components';
import { isHex } from '@polkadot/util';

import translate from './translate';

interface Props extends I18nProps {
  value?: string;
}

interface State {
  value: string;
  isNumber: boolean;
  isValid: boolean;
}

class Query extends TxComponent<Props, State> {
  public constructor (props: Props) {
    super(props);

    const { value } = this.props;

    this.state = this.stateFromValue(value || '');
  }

  public render (): React.ReactNode {
    const { className, t } = this.props;
    const { value, isValid } = this.state;

    return (
      <FilterOverlay className={className}>
        <Input
          className='explorer--query'
          defaultValue={this.props.value}
          isError={!isValid && value.length !== 0}
          placeholder={t('block hash or number to query')}
          onChange={this.setHash}
          onEnter={this.submit}
          withLabel={false}
        >
          <Button
            icon='play'
            isPrimary
            onClick={this.onQuery}
            ref={this.button}
          />
        </Input>
      </FilterOverlay>
    );
  }

  private setHash = (value: string): void => {
    this.setState(
      this.stateFromValue(value)
    );
  }

  private onQuery = (): void => {
    const { isValid, value } = this.state;

    if (isValid && value.length !== 0) {
      window.location.hash = `/explorer/query/${value}`;
    }
  }

  private stateFromValue (value: string): State {
    const isValidHex = isHex(value, 256);
    const isNumber = !isValidHex && /^\d+$/.test(value);

    return {
      value,
      isNumber,
      isValid: isValidHex || isNumber
    };
  }
}

export default translate(styled(Query)`
  .explorer--query {
    width: 20em;
  }
`);
