// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppNavigation } from '@polkadot/react-components/types';

import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export default function useAppNavigation (): AppNavigation {
  const history = useHistory();

  const navigator = useCallback(
    (path: string): () => void => {
      return function (): void {
        history.push(path);
      }
    },
    []
  );

  return {
    addCode: navigator('/upload/add'),
    deploy: navigator('/deploy'),
    deployNew: useCallback(
      (id?: string, constructorIndex = 0): () => void => {
        return navigator(`/deploy/new/${id}/${constructorIndex}`);
      },
      []
    ),
    execute: navigator('/execute'),
    upload: navigator('/upload'),
    uploadSuccess: useCallback(
      (id?: string): () => void => {
        return navigator(`/upload/success/${id}`);
      },
      []
    ),
  };
}