// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import SUICheckbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import styled from 'styled-components';

interface Props extends BareProps {
  asSwitch?: boolean;
  defaultValue?: boolean;
  isDisabled?: boolean;
  label: React.ReactNode;
  onChange?: (isChecked: boolean) => void;
  value?: boolean;
}

class Toggle extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, asSwitch = true, defaultValue, isDisabled, value, label } = this.props;

    return (
      <div className={className}>
        <label>{label}</label>
        <SUICheckbox
          checked={value}
          disabled={isDisabled}
          defaultChecked={defaultValue}
          onChange={this.onChange}
          toggle={asSwitch}
        />
      </div>
    );
  }

  private onChange = (_: React.FormEvent<HTMLInputElement>, { checked }: any): void => {
    const { onChange } = this.props;

    onChange && onChange(checked);
  }
}

export default styled(Toggle)`
  > label {
    display: inline-block;
    margin: 0 0.5rem;
  }

  > label,
  > .ui.checkbox {
    vertical-align: middle;
  }

  .ui.checkbox + label {
    color: rgba(78, 78, 78, 0.75);
  }
`;
