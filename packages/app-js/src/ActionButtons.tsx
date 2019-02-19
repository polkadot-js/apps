// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button as SUIB, Popup } from 'semantic-ui-react';
import { Button, Input } from '@polkadot/ui-app/index';

import translate from './translate';

type Props = BareProps & I18nProps & {
  isCustomExample: boolean,
  isRunning: boolean,
  saveSnippet: (snippetName: string) => void,
  generateLink: () => void,
  removeSnippet: () => void,
  runJs: () => void,
  stopJs: () => void
};

type State = {
  snippetName: string,
  isOpen: boolean
};

class ActionButtons extends React.PureComponent<Props, State> {
  state: State = {
    snippetName: '',
    isOpen: false
  };

  render () {
    const {
      props: { isCustomExample, isRunning, generateLink, removeSnippet, runJs, stopJs, t },
      state: { isOpen, snippetName }
     } = this;

    return (
      <div className='action-button'>
        <Popup
          content={t('Generate link to share code example')}
          on='hover'
          trigger={
            <SUIB
              circular
              icon='share alternate'
              onClick={generateLink}
            />
          }
          wide={'very'}
        />

        {
        // FIXME: The <Popup /> event trigger on='hover' does not work together with the ui-app'
        // <Button /> component. That's why the original Semantic UI component is being used here.
        }
        { isCustomExample &&
          <Popup
            content={t('Delete this custom example')}
            on='hover'
            trigger={
              <SUIB
                circular
                negative
                icon='trash alternate outline'
                onClick={removeSnippet}
              />
            }
          />
        }
        { !(isCustomExample) &&
          <Popup
            className='popup-local'
            open={isOpen}
            onClose={this.onPopupClose}
            trigger={
              <SUIB
                circular
                onClick={this.onPopupOpen}
                positive
                icon='save'
              />
            }
            on='click'
          >
            <Input
              autoFocus={true}
              onChange={this.onChangeName}
              onBlur={this.onPopupClose}
              withLabel={false}
              maxLength={50}
              min={1}
              placeholder={t('Name your example')}
            />
            <Button
              onClick={this.saveSnippet}
              label={t('Save snippet to local storage')}
              isDisabled={!snippetName.length}
              isPositive
            />
          </Popup>
        }

        <Button
          isCircular
          isPrimary
          icon='play'
          onClick={runJs}
        />
        <Button
          isCircular
          isDisabled={!isRunning}
          isNegative
          icon='close'
          onClick={stopJs}
        />
      </div>
    );
  }

  private onChangeName = (snippetName: string): void => {
    this.setState({ snippetName } as State);
  }

  private saveSnippet = (): void => {
    const { state: { snippetName }, props: { saveSnippet } } = this;

    saveSnippet(snippetName);
    this.setState({ snippetName: '', isOpen: false } as State);
  }

  private onPopupOpen = (): void => {
    this.setState((prevState: State): State => ({ isOpen: !prevState.isOpen }) as State);
  }

  private onPopupClose = (): void => {
    this.setState({ snippetName: '', isOpen: false } as State);
  }
}

export default translate(ActionButtons);
