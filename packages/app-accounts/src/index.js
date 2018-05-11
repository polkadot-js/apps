// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';

import Creator from './Creator';
import Editor from './Editor';
import translate from './translate';

type Props = I18nProps & {};

type Actions = 'create' | 'edit';

type State = {
  action: Actions
}

// FIXME React-router would probably be the best route, not home-grown
const Components: { [Actions]: React$ComponentType<*> } = {
  'create': Creator,
  'edit': Editor
};

class App extends React.PureComponent<Props, State> {
  state: State = { action: 'edit' };

  render (): React$Node {
    const { className, style, t } = this.props;
    const { action } = this.state;
    const Component = Components[action];

    return (
      <div
        className={['accounts--App', className].join(' ')}
        style={style}
      >
        <div className='accounts--App-navigation'>
          <Button.Group>
            <Button
              onClick={this.selectEdit}
              primary={action === 'edit'}
            >
              {t('app.edit', {
                defaultValue: 'Edit account'
              })}
            </Button>
            <Button.Or
              text={t('app.or', {
                defaultValue: 'or'
              })}
            />
            <Button
              onClick={this.selectCreate}
              primary={action === 'create'}
            >
              {t('app.create', {
                defaultValue: 'Create account'
              })}
            </Button>
          </Button.Group>
        </div>
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

export default translate(App);
