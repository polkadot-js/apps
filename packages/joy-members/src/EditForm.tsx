import BN from 'bn.js';
import React from 'react';
import { Form, Field, ErrorMessage, withFormik, FormikProps, FormikErrors, FormikTouched } from 'formik';
import * as Yup from 'yup';

import { Option, Text } from '@polkadot/types';
import { BareProps } from '@polkadot/ui-app/types';
import Section from '@polkadot/joy-utils/Section';
import TxButton from '@polkadot/joy-utils/TxButton';
import { nonEmptyStr, ZERO } from '@polkadot/joy-utils/index';
import { SubmittableResult } from '@polkadot/api';
import { MemberId, UserInfo, Profile } from './types';
import { MyAccountProps, withMyAccount } from '@polkadot/joy-utils/MyAccount';
import { queryMembershipToProp } from './utils';
import { withCalls } from '@polkadot/ui-api/index';
import { Button } from 'semantic-ui-react';

// TODO get next settings from Substrate:
const HANDLE_REGEX = /^[a-z0-9_]+$/;

const buildSchema = (p: ValidationProps) => Yup.object().shape({
  handle: Yup.string()
    .matches(HANDLE_REGEX, 'Handle can have only lowercase letters (a-z), numbers (0-9) and underscores (_).')
    .min(p.minHandleLength, `Handle is too short. Minimum length is ${p.minHandleLength} chars.`)
    .max(p.maxHandleLength, `Handle is too long. Maximum length is ${p.maxHandleLength} chars.`)
    .required('Handle is required'),
  avatar: Yup.string()
    .url('Avatar must be a valid URL of an image.')
    .max(p.maxAvatarUriLength, `Avatar URL is too long. Maximum length is ${p.maxAvatarUriLength} chars.`),
  about: Yup.string()
    .max(p.maxAboutTextLength, `Text is too long. Maximum length is ${p.maxAboutTextLength} chars.`)
});

type ValidationProps = {
  minHandleLength: number,
  maxHandleLength: number,
  maxAvatarUriLength: number,
  maxAboutTextLength: number
};

type OuterProps = ValidationProps & {
  profile?: Profile
};

type FormValues = {
  handle: string,
  avatar: string,
  about: string
};

type FieldName = keyof FormValues;

type FormProps = OuterProps & FormikProps<FormValues>;

type LabelledProps = BareProps & {
  name?: FieldName,
  label?: string,
  placeholder?: string,
  children?: JSX.Element | JSX.Element[],
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

const InnerForm = (props: FormProps) => {
  const {
    profile,
    values,
    dirty,
    isValid,
    isSubmitting,
    setSubmitting,
    resetForm
  } = props;

  const {
    handle,
    avatar,
    about
  } = values;

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

    const userInfo = new UserInfo({
      handle: new Option(Text, handle),
      avatar_uri: new Option(Text, avatar),
      about: new Option(Text, about)
    });

    if (profile) {
      return [userInfo];
    } else {
      // TODO get from 'query.membership.activePaidMembershipTerms: BN'
      const termsId = ZERO;
      return [termsId, userInfo];
    }
  };

  // TODO show warning that you don't have enough balance to buy a membership

  return (
    <Section title='My Membership Profile'>
    <Form className='ui form JoyForm'>
      <LabelledText name='handle' label='Handle/nickname' placeholder={`You can use a-z, 0-9 and underscores.`} style={{ maxWidth: '30rem' }} {...props}/>
      <LabelledText name='avatar' label='Avatar URL' placeholder='Paste here an URL of your avatar image.' {...props}/>
      <LabelledField name='about' label='About' {...props}>
        <Field component='textarea' id='about' name='about' disabled={isSubmitting} rows={3} placeholder='Write here anything you would like to share about yourself with Joystream community.' />
      </LabelledField>
      <LabelledField {...props}>
        <TxButton
          type='submit'
          size='large'
          label={profile ? 'Update my profile' : 'Register'}
          isDisabled={!dirty || isSubmitting}
          params={buildTxParams()}
          tx={profile
            ? 'membership.updateProfile'
            : 'membership.buyMembership'
          }
          onClick={onSubmit}
          onTxCancelled={onTxCancelled}
          onTxFailed={onTxFailed}
          onTxSuccess={onTxSuccess}
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
    </Section>
  );
};

const EditForm = withFormik<OuterProps, FormValues>({

  // Transform outer props into form values
  mapPropsToValues: props => {
    const { profile: p } = props;
    return {
      handle: p ? p.handle.toString() : '',
      avatar: p ? p.avatar_uri.toString() : '',
      about:  p ? p.about.toString() : ''
    };
  },

  validationSchema: buildSchema,

  handleSubmit: values => {
    // do submitting things
  }
})(InnerForm);

type WithMyProfileProps = {
  memberId?: MemberId,
  memberProfile?: Option<any>, // TODO refactor to Option<Profile>
  minHandleLength?: BN,
  maxHandleLength?: BN,
  maxAvatarUriLength?: BN,
  maxAboutTextLength?: BN
};

function WithMyProfileInner (p: WithMyProfileProps) {
  const triedToFindProfile = !p.memberId || p.memberProfile;
  if (
    triedToFindProfile &&
    p.minHandleLength &&
    p.maxHandleLength &&
    p.maxAvatarUriLength &&
    p.maxAboutTextLength
  ) {
    const profile = p.memberProfile ? p.memberProfile.unwrapOr(undefined) : undefined;
    return <EditForm
      minHandleLength={p.minHandleLength.toNumber()}
      maxHandleLength={p.maxHandleLength.toNumber()}
      maxAvatarUriLength={p.maxAvatarUriLength.toNumber()}
      maxAboutTextLength={p.maxAboutTextLength.toNumber()}
      profile={profile as Profile}
    />;
  } else return <em>Loading...</em>;
}

const WithMyProfile = withCalls<WithMyProfileProps>(
  queryMembershipToProp('minHandleLength'),
  queryMembershipToProp('maxHandleLength'),
  queryMembershipToProp('maxAvatarUriLength'),
  queryMembershipToProp('maxAboutTextLength'),
  queryMembershipToProp('memberProfile', 'memberId')
)(WithMyProfileInner);

type WithMyMemberIdProps = MyAccountProps & {
  memberIdByAccountId?: Option<MemberId>
};

function WithMyMemberIdInner (p: WithMyMemberIdProps) {
  if (p.memberIdByAccountId) {
    const memberId = p.memberIdByAccountId.unwrapOr(undefined);
    return <WithMyProfile memberId={memberId} />;
  } else return <em>Loading...</em>;
}

const WithMyMemberId = withMyAccount(withCalls<WithMyMemberIdProps>(
  queryMembershipToProp('memberIdByAccountId', 'myAddress')
)(WithMyMemberIdInner));

export default WithMyMemberId;
