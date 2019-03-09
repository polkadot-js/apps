// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, Input } from '@polkadot/ui-app/index';
import { isHex } from '@polkadot/util';

import translate from '../translate';

type Props = I18nProps & {
  hash?: string
};

type State = {
  hash: string
  isValid: boolean
};

class Query extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const { hash } = this.props;

    this.state = {
      hash: hash || '',
      isValid: isHex(hash, 256)
    };
  }

  render () {
    const { t } = this.props;
    const { hash, isValid } = this.state;

    return (
      <summary>
        <div className='ui--row'>
          <div className='small' />
          <div className='storage--actionrow medium'>
            <Input
              className='storage--actionrow-value'
              defaultValue={this.props.hash}
              isError={!isValid && hash.length !== 0}
              placeholder={t('block hash to query')}
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

  private setHash = (hash: string) => {
    this.setState({
      hash,
      isValid: isHex(hash, 256)
    });
  }

  private onQuery = () => {
    const { hash } = this.state;

    window.location.hash = `/explorer/hash/${hash}`;
  }
}

export default translate(Query);
