// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable @typescript-eslint/unbound-method */

import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable, DraggableLocation, DraggableProvided, DraggableStateSnapshot, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useDebounce } from '@polkadot/react-hooks';

// FIXME :()
import { PORTAL_ID } from '../../apps/src/Apps';
import { useTranslation } from './translate';
import AddressToggle from './AddressToggle';
import Input from './Input';

interface Props {
  available: string[];
  availableLabel: React.ReactNode;
  className?: string;
  help: React.ReactNode;
  maxCount: number;
  onChange: (values: string[]) => void;
  valueLabel: React.ReactNode;
  value: string[];
}

function uniquesOf (list: string[]): string[] {
  return [...new Set(list)];
}

function InputAddressMulti ({ available: propsAvailable = [], className, help, maxCount, onChange, availableLabel, valueLabel, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [_filter, setFilter] = useState<string>('');
  const filter = useDebounce(_filter);

  const available = useMemo(
    (): string[] => uniquesOf(propsAvailable),
    [propsAvailable]
  );

  const isSelected = useMemo(
    (): Record<string, boolean> => {
      return available.reduce(
        (result: Record<string, boolean>, address) => {
          return {
            ...result,
            [address]: value.includes(address)
          };
        },
        {}
      );
    },
    [value, available]
  );

  const onReorder = (source: DraggableLocation, destination: DraggableLocation): void => {
    const result = Array.from(value);
    const [removed] = result.splice(source.index, 1);

    result.splice(destination.index, 0, removed);

    onChange(uniquesOf(result));
  };

  const onSelect = (address: string): () => void => {
    return (): void => {
      if (isSelected[address] || (maxCount && value.length >= maxCount)) {
        return;
      }

      onChange(
        uniquesOf(
          [
            ...value,
            address
          ]
        )
      );
    };
  };

  const onDeselect = (index: number): () => void => {
    return (): void => {
      onChange(
        uniquesOf([
          ...value.slice(0, index),
          ...value.slice(index + 1)
        ])
      );
    };
  };

  const onDragEnd = (result: DropResult): void => {
    const { destination, source } = result;

    !!destination && onReorder(source, destination);
  };

  return (
    <div className={`ui--InputAddressMulti ${className}`}>
      <div className='ui--InputAddressMulti-column'>
        <Input
          autoFocus
          className='ui--InputAddressMulti-Input label-small'
          label={availableLabel}
          onChange={setFilter}
          placeholder={t('filter by name, address, or account index')}
          value={_filter}
        />
        <div className='ui--InputAddressMulti-items'>
          {available.map((address): React.ReactNode => (
            <AddressToggle
              address={address}
              filter={filter}
              isHidden={isSelected[address]}
              key={address}
              noToggle
              onChange={onSelect(address)}
            />
          ))}
        </div>
      </div>
      <div className='ui--InputAddressMulti-column'>
        <Input
          autoFocus
          className='ui--InputAddressMulti-Input label-small'
          help={help}
          inputClassName='retain-appearance'
          isDisabled
          label={valueLabel}
          onChange={setFilter}
          placeholder={t('drag and drop to reorder')}
          value={''}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='available'>
            {(provided: DroppableProvided): React.ReactElement => (
              <div
                className='ui--InputAddressMulti-items'
                ref={provided.innerRef}
              >
                {value.map((address, index): React.ReactNode => (
                  <Draggable
                    draggableId={address}
                    index={index}
                    key={address}
                  >
                    {(provided: DraggableProvided, snapshot: DraggableStateSnapshot): React.ReactElement => {
                      const element = (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <AddressToggle
                            address={address}
                            className={snapshot.isDragging ? 'isDragging' : ''}
                            noToggle
                            onChange={onDeselect(index)}
                          />
                        </div>
                      );

                      if (snapshot.isDragging) {
                        return ReactDOM.createPortal(element, document.getElementById(PORTAL_ID) as Element);
                      }

                      return element;
                    }}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default React.memo(styled(InputAddressMulti)`
  border-top-width: 0px;
  margin-left: 2rem;
  width: calc(100% - 2rem);
  display: inline-flex;
  justify-content: space-between;

  .ui--InputAddressMulti-Input {
    .ui.input {
      margin-bottom: 0rem;
      opacity: 1 !important;

      input {
        border-bottom-width: 0px;
        border-bottom-right-radius: 0px;
        border-bottom-left-radius: 0px;
      }
    }
  }

  .ui--InputAddressMulti-column {
    display: flex;
    flex-direction: column;
    min-height: 15rem;
    max-height: 15rem;
    width: 50%;
    padding: 0.25rem 0.5rem;

    .ui--InputAddressMulti-items {
      background: white;
      border: 1px solid rgba(34,36,38,0.15);
      border-top-width: 0;
      border-radius: 0 0 0.286rem 0.286rem;
      flex: 1;
      overflow-y: auto;
    }
  }
`);
