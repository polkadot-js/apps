// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { ComponentProps } from './types';

import React from 'react';
import { createType } from '@polkadot/types';
import { Button, Icon, Extrinsic, TxButton, TxComponent } from '@polkadot/react-components';
import { registry } from '@polkadot/react-api';
import { withApi, withMulti } from '@polkadot/react-api/hoc';

import translate from './translate';

interface Props extends I18nProps, ApiProps, ComponentProps {
  onChange: (accountId?: string) => void;
}

interface State {
  method: SubmittableExtrinsic<'promise'> | null;
  isValid: boolean;
}

class Propose extends TxComponent<Props, State> {
  public state: State = {
    isValid: false,
    method: null
  };

  public render (): React.ReactNode {
    const { apiDefaultTxSudo, isMine, sudoKey, t } = this.props;
    const { isValid, method } = this.state;

    return isMine
      ? (
        <section>
          <Extrinsic
            defaultValue={apiDefaultTxSudo}
            label={t('submit the following change')}
            onChange={this.onChangeExtrinsic}
            onEnter={this.sendTx}
          />
          <br />
          <Button.Group>
            <TxButton
              accountId={sudoKey}
              icon='sign-in'
              isDisabled={!method || !isValid}
              label={t('Submit Sudo')}
              params={method ? [createType(registry, 'Proposal', method)] : []}
              tx='sudo.sudo'
              withSpinner
            />
          </Button.Group>
        </section>
      )
      : (
        <article className='error padded'>
          <div>
            <Icon name='ban' />
            {t('You do not have access to the current sudo key')}
          </div>
        </article>
      );
  }

  private nextState (newState: Partial<State>): void {
    this.setState(
      (prevState: State): State => {
        const { method = prevState.method } = newState;

        return {
          isValid: !!method,
          method
        };
      }
    );
  }

  private onChangeExtrinsic = (method?: SubmittableExtrinsic<'promise'>): void => {
    if (!method) {
      return;
    }

    this.nextState({ method });
  }
}

export default withMulti(
  Propose,
  translate,
  withApi
);
