// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RefObject, useCallback, useEffect } from 'react';

function getClickedElement (refs: React.RefObject<HTMLDivElement>[], e: MouseEvent) {
  return refs.find((ref) => ref.current && ref.current.contains(e.target as HTMLElement));
}

export const useOutsideClick = (elements: RefObject<HTMLDivElement>[], callback: () => void): void => {
  const handleClick = useCallback((e: MouseEvent) => {
    if (elements.length && !getClickedElement(elements, e)) {
      callback();
    }
  }, [elements, callback]);

  useEffect(() => {
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [handleClick, callback]);
};
