// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { I18nProps } from '@canvas-ui/react-components/types';
import { ComponentMap, ParamDef, RawParam, RawParams, RawParamOnChangeValue, UseTxParams } from './types';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ErrorBoundary } from '@canvas-ui/react-components';

import Holder from './Holder';
import ParamComp from './ParamComp';
import translate from './translate';

export { default as useTxParams } from './useTxParams';

interface Props extends I18nProps, UseTxParams {
  children?: React.ReactNode;
  isDisabled?: boolean;
  onEnter?: () => void;
  onError?: () => void;
  onEscape?: () => void;
  overrides?: ComponentMap;
  withBorder?: boolean;
}

interface State {
  params?: ParamDef[] | null;
  values?: RawParams;
}

export { Holder };

function Params ({ children, className = '', isDisabled, onChange, onEnter, onError, onEscape, overrides, params, values, withBorder = true }: Props): React.ReactElement<Props> | null {
  const onRenderError = useCallback((): void => {
    onError && onError();
  }, [onError]);

  const prevValues = useRef(values);

  const onChangeParam = useCallback(
    (index: number, newValue: RawParamOnChangeValue): void => {
      if (isDisabled) {
        return;
      }

      const { isValid = false, value } = newValue;

      onChange && onChange(
        (prevValues.current || []).map((prev, prevIndex): RawParam =>
          prevIndex !== index
            ? prev
            : { isValid, value }
        )
      );
    },
    [isDisabled, onChange, prevValues]
  );

  useEffect((): void => {
    prevValues.current = values;
  });

  const content = useMemo(
    (): React.ReactNode => {
      if (values && values.length > 0 && params) {
        return params.map(({ name, type }: ParamDef, index: number): React.ReactNode => (
          <ParamComp
            defaultValue={values[index]}
            index={index}
            isDisabled={isDisabled}
            key={`${name || ''}:${type.toString()}:${index}`}
            name={name}
            onChange={onChangeParam}
            onEnter={onEnter}
            onEscape={onEscape}
            overrides={overrides}
            type={type}
          />
        ));
      }

      return null;
    },
    [isDisabled, onChangeParam, onEnter, onEscape, overrides, params, values]
  );

  if (!values || !values.length) {
    return null;
  }

  return (
    <Holder
      className={className}
      withBorder={withBorder}
    >
      <ErrorBoundary onError={onRenderError}>
        <div className='ui--Params-Content'>
          {content}
        </div>
        {children}
      </ErrorBoundary>
    </Holder>
  );
}

export default translate(Params);
