import React from 'react';
import { Button } from 'semantic-ui-react';
import { Form, Field, withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';

import TxButton from '@polkadot/joy-utils/TxButton';
import { SubmittableResult } from '@polkadot/api';

import * as JoyForms from '@polkadot/joy-utils/forms';

const buildSchema = (p: ValidationProps) => Yup.object().shape({
  name: Yup.string()
    // .min(p.minNameLen, `Name is too short. Minimum length is ${p.minNameLen} chars.`)
    // .max(p.maxNameLen, `Name is too long. Maximum length is ${p.maxNameLen} chars.`)
    .required('Name is required'),
  description: Yup.string()
    // .min(p.minDescLen, `Description is too short. Minimum length is ${p.minDescLen} chars.`)
    // .max(p.maxDescLen, `Description is too long. Maximum length is ${p.maxDescLen} chars.`)
    ,
  thumbnail: Yup.string()
    // .max(p.maxThumbLen, `Name is too long. Maximum length is ${p.maxThumbLen} chars.`)
    .url('Thumbnail must be a valid URL of an image.')
    .required('Thumbnail is required'),
  keywords: Yup.string()
    // .max(p.maxKeywordsLen, `Keywords are too long. Maximum length is ${p.maxKeywordsLen} chars.`)
});

type ValidationProps = {
  // minNameLen: number,
  // maxNameLen: number,
  // minDescLen: number,
  // maxDescLen: number,
  // maxThumbLen: number,
  // maxKeywordsLen: number
};

type OuterProps = ValidationProps & {
  fileName: string
};

type FormValues = {
  name: string,
  description: string,
  thumbnail: string,
  keywords: string
};

type FormProps = FormikProps<FormValues>;

const LabelledField = JoyForms.LabelledField<FormValues>();

const LabelledText = JoyForms.LabelledText<FormValues>();

const InnerForm = (props: FormProps) => {
  const {
    dirty,
    isValid,
    isSubmitting,
    setSubmitting,
    resetForm
  } = props;

  const onSubmit = (sendTx: () => void) => {
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

  const buildTxParams = () => {
    if (!isValid) return [];

    return [ ]; // TODO finish
  };

  return (
    <Form className='ui form JoyForm'>
      <LabelledText name='name' placeholder={`Name`} {...props} />
      <LabelledField name='description' {...props}>
        <Field component='textarea' id='description' name='description' disabled={isSubmitting} rows={3} placeholder='Description' />
      </LabelledField>
      <LabelledText name='thumbnail' placeholder={`Thumbnail image URL`} {...props} />
      <LabelledText name='keywords' placeholder={`Comma-separated keywords`} {...props} />

      <LabelledField {...props}>
        <TxButton
          type='submit'
          size='large'
          label={'Publish'}
          isDisabled={!dirty || isSubmitting}
          params={buildTxParams()}
          tx={'TODO.saveMetadata'} // TODO add or update metadata here
          onClick={onSubmit}
          txCancelledCb={onTxCancelled}
          txFailedCb={onTxFailed}
          txSuccessCb={onTxSuccess}
        />
        <Button
          type='button'
          size='large'
          disabled={!dirty || isSubmitting}
          onClick={() => resetForm()}
          content='Reset form'
        />
      </LabelledField>
    </Form>
  );
};

const EditForm = withFormik<OuterProps, FormValues>({

  // Transform outer props into form values
  mapPropsToValues: props => {
    return {
      name: props.fileName,
      description: '',
      thumbnail: '',
      keywords: ''
    };
  },

  validationSchema: buildSchema,

  handleSubmit: values => {
    // do submitting things
  }
})(InnerForm);

export default EditForm;
