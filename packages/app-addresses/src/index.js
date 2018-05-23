// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import classes from '@polkadot/ui-app/util/classes';

import Creator from './Creator';
import Editor from './Editor';
import translate from './translate';

type Props = I18nProps & {};

type Actions = 'create' | 'edit';

type State = {
  action: Actions
}

// FIXME React-router would probably be the best route, not home-grown
// flowlint-next-line unclear-type:off
const Components: { [Actions]: React$ComponentType<any> } = {
  'create': Creator,
  'edit': Editor
};

class AddressesApp extends React.PureComponent<Props, State> {
  state: State = { action: 'edit' };

  render (): React$Node {
    const { className, style, t } = this.props;
    const { action } = this.state;
    const Component = Components[action];

    return (
      <div
        className={classes('addresses--App', className)}
        style={style}
      >
        <Button.Group className='addresses--App-navigation'>
          <Button
            isPrimary={action === 'edit'}
            onClick={this.selectEdit}
            text={t('app.edit', {
              defaultValue: 'Edit address'
            })}
          />
          <Button.Or />
          <Button
            isPrimary={action === 'create'}
            onClick={this.selectCreate}
            text={t('app.create', {
              defaultValue: 'Add address'
            })}
          />
        </Button.Group>
        <Component onBack={this.selectEdit} />
      </div>
    );
  }

  selectCreate = (): void => {
    this.setState({ action: 'create' });
  }

  selectEdit = (): void => {
    this.setState({ action: 'edit' });
  }
}

export default translate(AddressesApp);
