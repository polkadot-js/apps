// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic, ExtrinsicSectionName } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';

type Props = I18nProps & {
  isError?: boolean,
  isPrivate?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange?: (event: SyntheticEvent<*>, value: Extrinsic) => void,
  subject?: rxjs$Subject<Extrinsic>
};

require('./InputExtrinsic.css');

const React = require('react');
const { BehaviorSubject } = require('rxjs/BehaviorSubject');
const map = require('@polkadot/extrinsics-substrate');
const withObservable = require('@polkadot/rx-react/with/observable');

const translate = require('../translate');
const SelectMethod = require('./SelectMethod');
const SelectSection = require('./SelectSection');
const methodOptions = require('./options/method');

class InputExtrinsic extends React.PureComponent<Props> {
  sectionSubject: rxjs$Subject<ExtrinsicSectionName>;
  SelectMethod: React$ComponentType<*>;

  constructor (props: Props) {
    super(props);

    this.sectionSubject = new BehaviorSubject(props.subject.getValue().section);
    this.SelectMethod = withObservable(this.sectionSubject)(
      withObservable(props.subject, { propName: 'ownValue' })(SelectMethod)
    );
  }

  componentWillMount () {
    this.sectionSubject.subscribe((nextSection) => {
      const current = this.props.subject.getValue();

      console.log('subscribe', nextSection, current);

      if (current.section === nextSection) {
        return;
      }

      const type = this.props.isPrivate ? 'private' : 'public';
      const options = methodOptions(nextSection, type);

      this.props.subject.next(
        map[nextSection].methods[type][options[0].value]
      );
    });
  }

  render (): React$Node {
    const { className, isPrivate = false, labelMethod, labelSection, onChange, style, subject, t } = this.props;
    const type = isPrivate ? 'private' : 'public';

    return (
      <div
        className={['ui--InputExtrinsic', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='small'>
          <SelectSection
            label={labelSection || t('input.extrinsic.section', {
              defaultValue: 'from extrinsic section'
            })}
            subject={this.sectionSubject}
            type={type}
          />
        </div>
        <div className='large'>
          <this.SelectMethod
            label={labelMethod || t('input.extrinsic.method', {
              defaultValue: 'with the extrinsic'
            })}
            onChange={onChange}
            subject={subject}
            type={type}
          />
        </div>
      </div>
    );
  }
}

module.exports = translate(InputExtrinsic);
