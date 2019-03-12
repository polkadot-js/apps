// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, Input } from '@polkadot/ui-app/index';
import { isHex } from '@polkadot/util';

import translate from '../translate';

type Props = I18nProps & {
  value?: string
};

type State = {
  value: string
  isNumber: boolean,
  isValid: boolean
};

class Query extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const { value } = this.props;

    this.state = this.stateFromValue(value || '');
  }

  render () {
    const { t } = this.props;
    const { value, isValid } = this.state;

    return (
      <summary>
        <div className='ui--row'>
          <div className='small' />
          <div className='storage--actionrow medium'>
            <Input
              className='storage--actionrow-value'
              defaultValue={this.props.value}
              isError={!isValid && value.length !== 0}
              placeholder={t('block hash or number to query')}
              onChange={this.setHash}
              withLabel={false}
            />
            <Button
              icon='play'
              isDisabled={!isValid}
              isPrimary
              onClick={this.onQuery}
            />
          </div>
        </div>
      </summary>
    );
  }

  private setHash = (value: string) => {
    this.setState(
      this.stateFromValue(value)
    );
  }

  private onQuery = () => {
    const { value } = this.state;

    window.location.hash = `/explorer/query/${value}`;
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

export default translate(Query);
