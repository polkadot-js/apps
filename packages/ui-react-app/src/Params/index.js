// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';
import type { ComponentMap, RawParam } from './types';

import './Params.css';

import React from 'react';

import translate from '../translate';
import Param from './Param';
import createSubjects from './subjects';

type Props = I18nProps & {
  overrides?: ComponentMap,
  subject: rxjs$BehaviorSubject<Array<RawParam>>,
  value: Extrinsic;
};

type State = {
  subjects: Array<rxjs$BehaviorSubject<RawParam>>,
  subscriptions: Array<rxjs$ISubscription>
};

class Params extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      subjects: [],
      subscriptions: []
    };
  }

  static unsubscribe (subscriptions: Array<rxjs$ISubscription>): void {
    subscriptions.forEach((s) =>
      s.unsubscribe()
    );
  }

  static getDerivedStateFromProps (props: Props, prevState: State): $Shape<State> | null {
    const { value: { params = {} } = {}, subject } = props;

    if (Object.keys(params).length === 0) {
      Params.unsubscribe(prevState.subscriptions);

      return {
        subjects: [],
        subscriptions: []
      };
    }

    const subjects = createSubjects(params, subject);
    let subscriptions;

    if (subject) {
      const onChange = (): void => {
        subject.next(
          subjects.map((s) => s.getValue())
        );
      };

      subscriptions = subjects.map((s) => s.subscribe(onChange));
    }

    return {
      subjects,
      subscriptions
    };
  }

  componentWillUnmount () {
    Params.unsubscribe(this.state.subscriptions);
  }

  render (): React$Node {
    const { className, overrides, style, value } = this.props;
    const { subjects } = this.state;

    if (!value || !subjects.length) {
      return null;
    }

    const { name, params = {} } = value;
    const paramNames = Object.keys(params);

    if (paramNames.length === 0) {
      return null;
    }

    return (
      <div
        className={['ui--Params', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='ui--Params-Content'>
          {paramNames.map((paramName, index) => {
            const { options, type } = params[paramName];

            return (
              <Param
                key={`${name}:${paramName}:${index}`}
                overrides={overrides}
                subject={subjects[index]}
                value={{
                  name: paramName,
                  options,
                  type
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default translate(Params);
