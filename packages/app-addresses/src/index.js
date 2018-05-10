// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import './index.css';

import React from 'react';
import Button from 'semantic-ui-react/dist/es/elements/Button';

import Creator from './Creator';
import Editor from './Editor';
import translate from './translate';

type Props = I18nProps & {};

type Actions = 'create' | 'edit';

type State = {
  currentAction: Actions,
  currentAddress: string | null
}

// FIXME React-router would probably be the best route, not home-grown
const Components: { [Actions]: React$ComponentType<*> } = {
  'create': Creator,
  'edit': Editor
};

class App extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      currentAction: 'edit',
      currentAddress: null
    };
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { currentAction } = this.state;
    const Component = Components[currentAction];

    return (
      <div
        className={['addresses--App', className].join(' ')}
        style={style}
      >
        <div className='addresses--App-navigation'>
          <Button.Group>
            <Button
              onClick={this.selectEdit}
              primary={currentAction === 'edit'}
            >
              {t('app.edit', {
                defaultValue: 'Edit address'
              })}
            </Button>
            <Button.Or
              text={t('app.or', {
                defaultValue: 'or'
              })}
            />
            <Button
              onClick={this.selectCreate}
              primary={currentAction === 'create'}
            >
              {t('app.create', {
                defaultValue: 'Add address'
              })}
            </Button>
          </Button.Group>
        </div>
        <Component onBack={this.selectEdit} />
      </div>
    );
  }

  setCurrentAction (currentAction: Actions): void {
    this.setState({ currentAction });
  }

  selectCreate = (): void => {
    this.setCurrentAction('create');
  }

  selectEdit = (): void => {
    this.setCurrentAction('edit');
  }
}

export default translate(App);
