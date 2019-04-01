import React from 'react';
import { Field, ErrorMessage, FormikErrors, FormikTouched } from 'formik';

import { BareProps } from '@polkadot/ui-app/types';
import { nonEmptyStr } from '@polkadot/joy-utils/index';

type FormValuesType = {
  [s: string]: string
};

type LabelledProps<FormValues = FormValuesType> = BareProps & {
  name?: keyof FormValues,
  label?: React.ReactNode,
  invisibleLabel?: boolean,
  placeholder?: string,
  children?: JSX.Element | JSX.Element[],
  errors: FormikErrors<FormValues>,
  touched: FormikTouched<FormValues>,
  isSubmitting: boolean
};

export function LabelledField<FormValues = FormValuesType> () {
  return (props: LabelledProps<FormValues>) => {
    const { name, label, invisibleLabel = false, touched, errors, children } = props;
    const hasError = name && touched[name] && errors[name];
    const fieldWithError = <>
      <div>{children}</div>
      {name && <ErrorMessage name={name as string} component='div' className='ui pointing red label' />}
    </>;
    return (label || invisibleLabel)
      ? <div className={`ui--Labelled field ${hasError ? 'error' : ''}`}>
          <label htmlFor={name as string}>{nonEmptyStr(label) && label + ':'}</label>
          <div className='ui--Labelled-content'>
            {fieldWithError}
          </div>
        </div>
      : <div className={`field ${hasError ? 'error' : ''}`}>
          {fieldWithError}
        </div>;
  };
}

export function LabelledText<FormValues = FormValuesType> () {
  const LF = LabelledField<FormValues>();
  return (props: LabelledProps<FormValues>) => {
    const { name, placeholder, className, style, ...otherProps } = props;
    const fieldProps = { className, style, name, placeholder };
    return <LF name={name} {...otherProps} >
      <Field id={name} disabled={otherProps.isSubmitting} {...fieldProps} />
    </LF>;
  };
}
