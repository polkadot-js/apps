// Copyright 2017-2020 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React, { useCallback, useState } from 'react';
import { Button as SUIB, Popup } from 'semantic-ui-react';
import { Button, Input } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props extends BareProps {
  isCustomExample: boolean;
  isRunning: boolean;
  removeSnippet: () => void;
  runJs: () => void;
  saveSnippet: (snippetName: string) => void;
  snippetName?: string;
  stopJs: () => void;
}

function ActionButtons ({ className, isCustomExample, isRunning, removeSnippet, runJs, saveSnippet, stopJs }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [snippetName, setSnippetName] = useState('');

  const _onChangeName = useCallback(
    (snippetName: string) => setSnippetName(snippetName),
    []
  );

  const _onPopupOpen = useCallback(
    () => setIsOpen(true),
    []
  );

  const _onPopupClose = useCallback(
    (): void => {
      setSnippetName('');
      setIsOpen(false);
    },
    []
  );

  const _saveSnippet = useCallback(
    (): void => {
      saveSnippet(snippetName);
      _onPopupClose();
    },
    [_onPopupClose, saveSnippet, snippetName]
  );

  return (
    <div className={`${className} action-button`}>
      {
      // FIXME: The <Popup /> event trigger on='hover' does not work together with the ui-app'
      // <Button /> component. That's why the original Semantic UI component is being used here.
      }
      {isCustomExample && (
        <Popup
          content={t('Delete this custom example')}
          on='hover'
          trigger={
            <SUIB
              circular
              icon='trash alternate outline'
              negative
              onClick={removeSnippet}
            />
          }
        />
      )}
      {!(isCustomExample) && (
        <Popup
          className='popup-local'
          on='click'
          onClose={_onPopupClose}
          open={isOpen}
          trigger={
            <SUIB
              circular
              icon='save'
              onClick={_onPopupOpen}
            />
          }
        >
          <Input
            autoFocus
            maxLength={50}
            min={1}
            onChange={_onChangeName}
            onEnter={_saveSnippet}
            placeholder={t('Name your example')}
            value={snippetName}
            withLabel={false}
          />
          <Button
            icon='save'
            isDisabled={!snippetName.length}
            isPrimary
            label={t('Save snippet to local storage')}
            onClick={_saveSnippet}
          />
        </Popup>
      )}
      {isRunning
        ? (
          <Button
            icon='close'
            isCircular
            isNegative
            onClick={stopJs}
          />
        )
        : (
          <Button
            className='play-button'
            icon='play'
            isCircular
            isPrimary
            onClick={runJs}
          />
        )
      }
    </div>
  );
}

export default React.memo(ActionButtons);
