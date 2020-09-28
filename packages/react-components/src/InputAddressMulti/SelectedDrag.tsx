// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import ReactDOM from 'react-dom';
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';

import { PORTAL_ID } from '../../../apps/src/Apps';
import AddressToggle from '../AddressToggle';

interface Props {
  address: string;
  index: number;
  onDeselect: (index: number) => void;
}

const portal = document.getElementById(PORTAL_ID) as Element;

function Selected ({ address, index, onDeselect }: Props): React.ReactElement<Props> {
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
              onChange={onDeselect}
            />
          </div>
        );

        return snapshot.isDragging
          ? ReactDOM.createPortal(element, portal)
          : element;
      }}
    </Draggable>
  );
}

export default React.memo(Selected);
