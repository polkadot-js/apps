// Copyright 2017-2021 @polkadot/app-execute authors & contributors
// and @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppNavigation, AppPaths } from './types';

import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

interface UseAppNavigation {
  navigateTo: AppNavigation,
  pathTo: AppPaths;
}

const pathTo: AppPaths = {
  execute: '/execute',
  executeAdd: '/execute/add',
  executeCall: (address: string, messageIndex = 0) => `/execute/${address}/${messageIndex}`,
  instantiate: '/instantiate',
  instantiateAdd: '/instantiate/add',
  instantiateNew: (id?: string, constructorIndex = 0) => id ? `/instantiate/new/${id}/${constructorIndex}` : '/instantiate/new',
  instantiateSuccess: (address: string) => `/instantiate/success/${address}`,
  upload: '/upload',
  uploadSuccess: (id: string) => `/upload/success/${id}`
};

export default function useAppNavigation (): UseAppNavigation {
  const history = useHistory();

  const navigateTo = useCallback(
    (path: string): () => void => {
      return (): void => {
        history.push(path);
      };
    },
    [history]
  );

  return {
    navigateTo: {
      execute: navigateTo(pathTo.execute),
      executeAdd: navigateTo(pathTo.executeAdd),
      executeCall: useCallback(
        (address: string, messageIndex = 0): () => void => {
          return navigateTo(pathTo.executeCall(address, messageIndex));
        },
        [navigateTo]
      ),
      instantiate: navigateTo(pathTo.instantiate),
      instantiateAdd: navigateTo(pathTo.instantiateAdd),
      instantiateNew: useCallback(
        (id?: string, constructorIndex = 0): () => void => {
          return navigateTo(pathTo.instantiateNew(id, constructorIndex));
        }, [navigateTo]
      ),
      instantiateSuccess: useCallback(
        (address: string): () => void => {
          return navigateTo(pathTo.instantiateSuccess(address));
        },
        [navigateTo]
      ),
      upload: navigateTo(pathTo.upload),
      uploadSuccess: useCallback(
        (id: string): () => void => {
          return navigateTo(`/upload/success/${id}`);
        },
        [navigateTo]
      )
    },
    pathTo
  };
}
