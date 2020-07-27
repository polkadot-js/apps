// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppNavigation } from './types';

import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export default function useAppNavigation (): AppNavigation {
  const history = useHistory();

  const navigator = useCallback(
    (path: string): () => void => {
      return function (): void {
        history.push(path);
      };
    },
    [history]
  );

  return {
    deploy: navigator('/deploy'),
    deployNew: useCallback(
      (id: string, constructorIndex = 0): () => void => {
        return navigator(`/deploy/new/${id}/${constructorIndex}`);
      },
      [navigator]
    ),
    deploySuccess: useCallback(
      (address: string): () => void => {
        return navigator(`/deploy/success/${address}`);
      },
      [navigator]
    ),
    execute: navigator('/execute'),
    executeAdd: navigator('/execute/add'),
    executeCall: useCallback(
      (address: string, messageIndex = 0): () => void => {
        return navigator(`/execute/${address}/${messageIndex}`);
      },
      [navigator]
    ),
    upload: navigator('/upload'),
    uploadAdd: navigator('/upload/add'),
    uploadSuccess: useCallback(
      (id: string): () => void => {
        return navigator(`/upload/success/${id}`);
      },
      [navigator]
    )
  };
}
