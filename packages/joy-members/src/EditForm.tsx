import BN from 'bn.js';
import React from 'react';
import { Form, Field, withFormik, FormikProps } from 'formik';
import * as Yup from 'yup';

import { Option, Vector } from '@polkadot/types';
import Section from '@polkadot/joy-utils/Section';
import TxButton from '@polkadot/joy-utils/TxButton';
import * as JoyForms from '@polkadot/joy-utils/forms';
import { SubmittableResult } from '@polkadot/api';
import { MemberId, UserInfo, Profile, PaidTermId, PaidMembershipTerms } from './types';
import { OptionText } from '@polkadot/joy-utils/types';
import { MyAccountProps, withMyAccount } from '@polkadot/joy-utils/MyAccount';
import { queryMembershipToProp } from './utils';
import { withCalls } from '@polkadot/ui-api/index';
import { Button, Message } from 'semantic-ui-react';
import { formatBalance } from '@polkadot/util';

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
  profile?: Profile,
  paidTerms: PaidMembershipTerms
};

type FormValues = {
  handle: string,
  avatar: string,
  about: string
};

type FieldName = keyof FormValues;

type FormProps = OuterProps & FormikProps<FormValues>;

const LabelledField = JoyForms.LabelledField<FormValues>();

const LabelledText = JoyForms.LabelledText<FormValues>();

const InnerForm = (props: FormProps) => {
  const {
    profile,
    paidTerms,
    initialValues,
    values,
    touched,
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

  // TODO extract to forms.tsx
  const isFieldChanged = (field: FieldName): boolean => {
    return dirty && touched[field] === true && values[field] !== initialValues[field];
  };

  // TODO extract to forms.tsx
  const fieldToTextOption = (field: FieldName): OptionText => {
    return isFieldChanged(field)
      ? OptionText.some(values[field])
      : OptionText.none();
  };

  const buildTxParams = () => {
    if (!isValid) return [];

    const userInfo = new UserInfo({
      handle:     fieldToTextOption('handle'),
      avatar_uri: fieldToTextOption('avatar'),
      about:      fieldToTextOption('about')
    });

    if (profile) {
      return [ userInfo ];
    } else {
      return [ paidTerms.id, userInfo ];
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
      {!profile && paidTerms &&
        <Message warning style={{ display: 'block', marginBottom: '0' }}>
          Membership costs <b>{formatBalance(paidTerms.fee)}</b> tokens
        </Message>
      }
      <LabelledField invisibleLabel {...props}>
        <TxButton
          type='submit'
          size='large'
          label={profile ? 'Update my profile' : 'Register'}
          isDisabled={!dirty || isSubmitting}
          params={buildTxParams()}
          tx={profile
            ? 'members.updateProfile'
            : 'members.buyMembership'
          }
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
  paidTermsId: PaidTermId,
  paidTerms?: Option<PaidMembershipTerms>,
  minHandleLength?: BN,
  maxHandleLength?: BN,
  maxAvatarUriLength?: BN,
  maxAboutTextLength?: BN
};

function WithMyProfileInner (p: WithMyProfileProps) {
  const triedToFindProfile = !p.memberId || p.memberProfile;
  if (
    triedToFindProfile &&
    p.paidTerms &&
    p.minHandleLength &&
    p.maxHandleLength &&
    p.maxAvatarUriLength &&
    p.maxAboutTextLength
  ) {
    const profile = p.memberProfile ? p.memberProfile.unwrapOr(undefined) : undefined;

    if (!profile && p.paidTerms.isNone) {
      console.error('Could not find active paid membership terms');
    }

    return <EditForm
      minHandleLength={p.minHandleLength.toNumber()}
      maxHandleLength={p.maxHandleLength.toNumber()}
      maxAvatarUriLength={p.maxAvatarUriLength.toNumber()}
      maxAboutTextLength={p.maxAboutTextLength.toNumber()}
      profile={profile as Profile}
      paidTerms={p.paidTerms.unwrap()}
    />;
  } else return <em>Loading...</em>;
}

const WithMyProfile = withCalls<WithMyProfileProps>(
  queryMembershipToProp('minHandleLength'),
  queryMembershipToProp('maxHandleLength'),
  queryMembershipToProp('maxAvatarUriLength'),
  queryMembershipToProp('maxAboutTextLength'),
  queryMembershipToProp('memberProfile', 'memberId'),
  queryMembershipToProp('paidMembershipTermsById',
    { paramName: 'paidTermsId', propName: 'paidTerms' })
)(WithMyProfileInner);

type WithMyMemberIdProps = MyAccountProps & {
  memberIdByAccountId?: Option<MemberId>,
  paidTermsIds?: Vector<PaidTermId>
};

function WithMyMemberIdInner (p: WithMyMemberIdProps) {
  if (p.memberIdByAccountId && p.paidTermsIds) {
    if (p.paidTermsIds.length) {
      const memberId = p.memberIdByAccountId.unwrapOr(undefined);
      return <WithMyProfile memberId={memberId} paidTermsId={p.paidTermsIds[0]} />;
    } else {
      console.error('Active paid membership terms is empty');
    }
  }
  return <em>Loading...</em>;
}

const WithMyMemberId = withMyAccount(withCalls<WithMyMemberIdProps>(
  queryMembershipToProp('memberIdByAccountId', 'myAddress'),
  queryMembershipToProp('activePaidMembershipTerms', { propName: 'paidTermsIds' })
)(WithMyMemberIdInner));

export default WithMyMemberId;
