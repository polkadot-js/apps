import BN from 'bn.js';
import React from 'react';
import { Formik, Form, Field, ErrorMessage, withFormik, FormikProps, FormikErrors, FormikConsumer, FormikTouched } from 'formik';
import * as Yup from 'yup';

import { BareProps } from '@polkadot/ui-app/types';
import Section from '@polkadot/joy-utils/Section';
import TxButton from '@polkadot/joy-utils/TxButton';
import { nonEmptyStr } from '@polkadot/joy-utils/index';
import { SubmittableResult } from '@polkadot/api';

// TODO get next settings from Substrate:
const HANDLE_REGEX = /^[a-z0-9_]+$/;
const HANDLE_MIN_LEN = 5;
const HANDLE_MAX_LEN = 50;
const AVATAR_MAX_LEN = 500;
const ABOUT_MAX_LEN = 1000;

const Schema = Yup.object().shape({
  handle: Yup.string()
    .matches(HANDLE_REGEX, 'Handle can have only lowercase letters (a-z), numbers (0-9) and underscores (_).')
    .min(HANDLE_MIN_LEN, `Handle is too short. Minimum length is ${HANDLE_MIN_LEN} chars.`)
    .max(HANDLE_MAX_LEN, `Handle is too long. Maximum length is ${HANDLE_MAX_LEN} chars.`)
    .required('Handle is required'),
  avatar: Yup.string()
    .url('Avatar must be a valid URL of an image.')
    .max(AVATAR_MAX_LEN, `Avatar URL is too long. Maximum length is ${AVATAR_MAX_LEN} chars.`),
  about: Yup.string()
    .max(ABOUT_MAX_LEN, `Text is too long. Maximum length is ${ABOUT_MAX_LEN} chars.`)
});

type FormValues = {
  handle: string,
  avatar: string,
  about: string
};

type FieldName = keyof FormValues;

const initialValues: FormValues = {
  handle: '',
  avatar: '',
  about: ''
};

type Props = FormikProps<FormValues> & {};

type LabelledProps = BareProps & {
  name?: FieldName,
  label?: string,
  placeholder?: string,
  children?: JSX.Element,
  errors: FormikErrors<FormValues>,
  touched: FormikTouched<FormValues>,
  isSubmitting: boolean
};

const LabelledField = (props: LabelledProps) => {
  const { name, label, touched, errors, children } = props;
  const hasError = name && touched[name] && errors[name];
  return <div className={`field ${hasError ? 'error' : ''} ui--Labelled`}>
    <label htmlFor={name}>{nonEmptyStr(label) && label + ':'}</label>
    <div className='ui--Labelled-content'>
      <div>{children}</div>
      {name && <ErrorMessage name={name} component='div' className='ui pointing red label' />}
    </div>
  </div>;
};

const LabelledText = (props: LabelledProps) => {
  const { name, placeholder, className, style, ...otherProps } = props;
  const fieldProps = { className, style, name, placeholder };
  return <LabelledField name={name} {...otherProps} >
    <Field id={name} disabled={otherProps.isSubmitting} {...fieldProps} />
  </LabelledField>;
};

const InnerForm = (props: Props) => {
  const {
    isSubmitting,
    setSubmitting,
    isValid
  } = props;

  const onSubmit = (sendTx: () => void) => {
    // console.log('on tx btn', { isValid, isSubmitting, submitCount, touched });
    if (isValid) sendTx();
  };

  const onTxCancelled = () => {
    setSubmitting(false);
  };

  const onTxFailed = (_txResult: SubmittableResult) => {
    setSubmitting(false);
  };

  const onTxSuccess = (_txResult: SubmittableResult) => {
    setSubmitting(false);
  };

  return (
    <Section title='Edit Membership Profile'>
    <Form className='ui form JoyForm'>
      <LabelledText name='handle' label='URL handle' style={{ maxWidth: '30rem' }} {...props}/>
      <LabelledText name='avatar' label='Avatar URL' placeholder='Paste here an URL of your avatar image.' {...props}/>
      <LabelledField name='about' label='About' {...props}>
        <Field component='textarea' id='about' name='about' disabled={isSubmitting} rows={3} placeholder='Write here anything you would like to share about yourself with Joystream community.' />
      </LabelledField>
      <LabelledField {...props}>
        <TxButton
          type='submit'
          size='large'
          label='Save my profile'
          isDisabled={isSubmitting}

          // TODO just a stub to test a form
          params={[ new BN(0) ]}
          tx='election.apply'
          // params={[ handle, avatar, about ]}
          // tx='membership.editProfile'

          onClick={onSubmit}
          onTxCancelled={onTxCancelled}
          onTxFailed={onTxFailed}
          onTxSuccess={onTxSuccess}
        />
      </LabelledField>
    </Form>
    </Section>
  );
};

type InputValues = FormValues;

const EditForm = withFormik<InputValues, FormValues>({

  // Transform outer props into form values
  mapPropsToValues: props => {
    return {
      handle: props.handle,
      avatar: props.avatar,
      about: props.about
    };
  },

  // initialValues,

  validationSchema: Schema,

  handleSubmit: values => {
    // do submitting things
  }
})(InnerForm);

export default EditForm;
