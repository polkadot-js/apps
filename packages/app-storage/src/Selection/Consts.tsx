// Copyright 2017-2019 @polkadot/app-storage authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ConstantCodec } from '@polkadot/api-metadata/consts/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { ConstValue } from '@polkadot/ui-app/InputConsts/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { ComponentProps } from '../types';

import React from 'react';
import { Button, InputConsts, TxComponent } from '@polkadot/ui-app';
import { withApi, withMulti } from '@polkadot/ui-api';

import translate from '../translate';

type Props = ComponentProps & ApiProps & I18nProps;

interface State {
  value: ConstValue;
}

class Consts extends TxComponent<Props, State> {
  private defaultValue: ConstValue;

  public state: State;

  public constructor (props: Props) {
    super(props);

    const { api } = this.props;
    const section = Object.keys(api.consts)[0];
    const method = Object.keys(api.consts[section])[0];

    this.defaultValue = {
      meta: (api.consts[section][method] as ConstantCodec).meta,
      method,
      section
    };
    this.state = {
      value: this.defaultValue
    };
  }

  public render (): React.ReactNode {
    const { api, t } = this.props;
    const { value: { method, section } } = this.state;
    const meta = (api.consts[section][method] as ConstantCodec).meta;

    return (
      <section className='storage--actionrow'>
        <div className='storage--actionrow-value'>
          <InputConsts
            defaultValue={this.defaultValue}
            label={t('selected constant query')}
            onChange={this.onChangeConst}
            help={meta && meta.documentation && meta.documentation.join(' ')}
          />
        </div>
        <div className='storage--actionrow-buttons'>
          <Button
            icon='plus'
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
    const { value } = this.state;

    onAdd({ isConst: true, key: value });
  }

  private onChangeConst = (value: ConstValue): void => {
    this.setState({ value });
  }
}

export default withMulti(
  Consts,
  translate,
  withApi
);
