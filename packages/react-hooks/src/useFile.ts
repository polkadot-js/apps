// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { VoidFn } from '@canvas-ui/react-util/types';
import { FileState, UseFile } from './types';

import { useCallback, useState, useMemo } from 'react';

interface FileOptions {
  defaultValue?: FileState | null;
  onChange?: (_: FileState) => void;
  onRemove?: VoidFn;
  validate?: (_: FileState) => boolean;
}

// Simple wrapper for a true/false toggle
export default function useFile ({ defaultValue = null, onChange, onRemove, validate = (file: FileState): boolean => file.data.length > 0 }: FileOptions | undefined = {}): UseFile {
  const [file, _setFile] = useState<FileState | null>(defaultValue);

  const setFile: React.Dispatch<FileState | null> = useCallback(
    (file: FileState | null) => {
      if (file) {
        _setFile(file);
        onChange && onChange(file);
      } else {
        _setFile(null);
        onRemove && onRemove();
      }
    },
    [_setFile, onChange, onRemove]
  );

  return useMemo(
    (): UseFile => {
      return [file, setFile, !!file, !!file && (validate(file) || false)];
    },
    [file, setFile, validate]
  );
}
