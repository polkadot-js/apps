// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useCallback, useMemo, useState } from 'react';
import { DragDropContext, Droppable, DraggableLocation, DroppableProvided, DropResult } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useDebounce } from '@polkadot/react-hooks';

// FIXME :()
import { useTranslation } from '../translate';
import Input from '../Input';
import Available from './Available';
import Selected from './Selected';

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
    (): Record<string, boolean> =>
      available.reduce(
        (result: Record<string, boolean>, address) => ({
          ...result,
          [address]: value.includes(address)
        }),
        {}
      ),
    [value, available]
  );

  const _onReorder = useCallback(
    (source: DraggableLocation, destination: DraggableLocation): void => {
      const result = Array.from(value);
      const [removed] = result.splice(source.index, 1);

      result.splice(destination.index, 0, removed);

      onChange(uniquesOf(result));
    },
    [onChange, value]
  );

  const _onSelect = useCallback(
    (address: string): void => {
      if (isSelected[address] || (maxCount && value.length >= maxCount)) {
        return;
      }

      onChange(
        uniquesOf([...value, address])
      );
    },
    [isSelected, maxCount, onChange, value]
  );

  const _onDeselect = useCallback(
    (index: number): void =>
      onChange(
        uniquesOf([...value.slice(0, index), ...value.slice(index + 1)])
      ),
    [onChange, value]
  );

  const _onDragEnd = useCallback(
    (result: DropResult): void => {
      const { destination, source } = result;

      !!destination && _onReorder(source, destination);
    },
    [_onReorder]
  );

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
            <Available
              address={address}
              filter={filter}
              isHidden={isSelected[address]}
              key={address}
              onSelect={_onSelect}
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
        />
        <DragDropContext onDragEnd={_onDragEnd}>
          <Droppable droppableId='available'>
            {(provided: DroppableProvided): React.ReactElement => (
              <div
                className='ui--InputAddressMulti-items'
                // eslint-disable-next-line @typescript-eslint/unbound-method
                ref={provided.innerRef}
              >
                {value.map((address, index): React.ReactNode => (
                  <Selected
                    address={address}
                    index={index}
                    key={address}
                    onDeselect={_onDeselect}
                  />
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
