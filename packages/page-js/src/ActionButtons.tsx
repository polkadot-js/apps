// Copyright 2017-2020 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import { Button, Input, Popup } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  isCustomExample: boolean;
  isRunning: boolean;
  removeSnippet: () => void;
  runJs: () => void;
  saveSnippet: (snippetName: string) => void;
  snippetName?: string;
  stopJs: () => void;
}

function ActionButtons ({ className = '', isCustomExample, isRunning, removeSnippet, runJs, saveSnippet, stopJs }: Props): React.ReactElement<Props> {
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
    <Button.Group className={`${className} action-button`}>
      {isCustomExample
        ? (
          <Button
            icon='trash'
            onClick={removeSnippet}
          />
        )
        : (
          <Popup
            className='popup-local'
            isOpen={isOpen}
            on='click'
            onClose={_onPopupClose}
            trigger={
              <Button
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
              placeholder={t<string>('Name your example')}
              value={snippetName}
              withLabel={false}
            />
            <Button
              icon='save'
              isDisabled={!snippetName.length}
              label={t<string>('Save snippet to local storage')}
              onClick={_saveSnippet}
            />
          </Popup>
        )
      }
      {isRunning
        ? (
          <Button
            icon='times'
            onClick={stopJs}
          />
        )
        : (
          <Button
            className='play-button'
            icon='play'
            onClick={runJs}
          />
        )
      }
    </Button.Group>
  );
}

export default React.memo(ActionButtons);
