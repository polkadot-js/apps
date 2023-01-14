// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { createRoot } from 'react-dom/client';

import { PORTAL_ID } from '../../../apps/src/Apps';
import AddressToggle from '../AddressToggle';

interface Props {
  address: string;
  index: number;
  onDeselect: (index: number) => void;
}

const portal = document.getElementById(PORTAL_ID) as HTMLElement;

function Selected ({ address, index, onDeselect }: Props): React.ReactElement<Props> {
  const onChange = useCallback(
    () => onDeselect(index),
    [index, onDeselect]
  );

  return (
    <Draggable
      draggableId={address}
      index={index}
      key={address}
    >
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot): React.ReactElement => {
        const element = (
          <div
            // eslint-disable-next-line @typescript-eslint/unbound-method
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <AddressToggle
              address={address}
              className={snapshot.isDragging ? 'isDragging' : ''}
              noToggle
              onChange={onChange}
            />
          </div>
        );

        return snapshot.isDragging
          ? createRoot(portal).render(element) as unknown as React.ReactElement
          : element;
      }}
    </Draggable>
  );
}

export default React.memo(Selected);
