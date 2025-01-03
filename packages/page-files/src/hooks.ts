// Copyright 2017-2025 @polkadot/app-files authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SaveFile } from './types.js';

import { useCallback, useEffect, useMemo, useState } from 'react';
import store from 'store';

export interface Files {
  files: SaveFile[],
}

export interface WrapFiles extends Files {
  isLoad: boolean,
  setFiles: (files: SaveFile[]) => void
}

const defFilesObj = { files: [], isLoad: true };

export function useFiles (): WrapFiles {
  const [filesObj, setFilesObj] = useState<Files>(defFilesObj);
  const [isLoad, setIsLoad] = useState(true);

  useEffect(() => {
    try {
      const f = store.get('files', defFilesObj) as Files;

      if (f !== defFilesObj) {
        setFilesObj(f);
      }

      setIsLoad(false);
    } catch (e) {
      setIsLoad(false);
      console.error(e);
    }
  }, []);
  const setFiles = useCallback((nFiles: SaveFile[]) => {
    const nFilesObj = { ...filesObj, files: nFiles };

    setFilesObj(nFilesObj);
    store.set('files', nFilesObj);
  }, [filesObj]);

  return useMemo(() => ({ ...filesObj, isLoad, setFiles }), [filesObj, setFiles, isLoad]);
}
