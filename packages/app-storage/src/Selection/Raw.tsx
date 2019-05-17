// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps } from '../types';

import React from 'react';
import { Button, Input, TxComponent } from '@polkadot/ui-app';

import translate from '../translate';
import { u8aToU8a } from '@polkadot/util';
import { Compact } from '@polkadot/types';

type Props = ComponentProps & I18nProps;

type State = {
  isValid: boolean,
  key: Uint8Array
};

class Raw extends TxComponent<Props, State> {
  state: State = {
    isValid: false,
    key: new Uint8Array([])
  };

  render () {
    const { t } = this.props;
    const { isValid } = this.state;

    return (
      <section className='storage--actionrow'>
        <div className='storage--actionrow-value'>
          <Input
            autoFocus
            label={t('hex-encoded storage key')}
            onChange={this.onChangeKey}
            onEnter={this.submit}
          />
        </div>
        <div className='storage--actionrow-buttons'>
          <Button
            icon='plus'
            isDisabled={!isValid}
            isPrimary
            onClick={this.onAdd}
            ref={this.button}
          />
        </div>
      </section>
    );
  }

  private onAdd = (): void => {
    const { onAdd } = this.props;
    const { key } = this.state;

    onAdd({ key });
  }

  private onChangeKey = (key: string): void => {
    const u8a = u8aToU8a(key);
    const isValid = u8a.length !== 0;

    this.setState({
      isValid,
      key: Compact.addLengthPrefix(u8a)
    });
  }
}

export default translate(Raw);
