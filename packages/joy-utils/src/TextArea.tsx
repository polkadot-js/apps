import React from 'react';
import { TextArea } from 'semantic-ui-react';
import { Labelled } from '@polkadot/ui-app/index';

type Props = {
  // TextArea
  as?: any,
  autoHeight?: boolean,
  rows?: number | string,
  style?: Object,
  value?: number | string,
  placeholder?: string,

  // Label
  onChange?: (value: string) => void,
  labelClass?: string,
  labelStyle?: {
    [index: string]: any
  },
  label?: string,
  withLabel?: boolean
};

export default class Component extends React.PureComponent<Props> {
  render () {
    const { as, autoHeight, rows, style, value, label, labelClass, labelStyle, withLabel = true, onChange, ...otherProps } = this.props;
    return (
      <Labelled
        className={labelClass}
        style={labelStyle}
        label={label}
        withLabel={withLabel}
      >
        <div className='ui form'>
          <TextArea
            {...otherProps}
            as={as}
            autoHeight={autoHeight}
            rows={rows}
            style={style}
            value={value}
            onChange={this.onChange}
          />
        </div>
      </Labelled>
    );
  }

  private onChange = (event: React.SyntheticEvent<Element>): void => {
    const { onChange } = this.props;
    const { value } = event.target as HTMLInputElement;

    onChange && onChange(value);
  }
}
