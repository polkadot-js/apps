
import React from 'react';
import { Grid } from 'semantic-ui-react';

import { I18nProps } from '@polkadot/ui-app/types';

// our app-specific styles
import './index.css';

// local imports and components
import translate from './translate';
import MemoView from '@polkadot/joy-utils/memo/MemoView';
import { Link } from 'react-router-dom';

const validatorsAccId = '5EoFVV4HrmyxF8xWNYL7rYJPEcDrW8kv3bHkb1ueGchBcZ1k';
const electionsAccId = '5CFW8VgJiM4jKSwskNzVVYfytcPcU7ppRtGKVBLgwpddTSjK';
const bugsAccId = '5H4RgAjmTBoNMrysDXJpac5KRURFnNYBHKC2FNmGoLXvv1LK';
const newsAccId = '5FvjTdBbyk7QqHcGHbwtc1RLiw6SUkzegdCWbppdtb63tmzi';

type Props = I18nProps & {};

const renderMemo = (accId: string) => {
  return <>
    <MemoView accountId={accId} preview={false} />
    <em className='AccountId'>
      <span>Memo of account </span>
      <Link to={`/addresses/memo/${accId}`}>{accId}</Link>
    </em>
  </>;
};

export const Component = (_props: Props) => {
  return (<>
    <div style={{ marginBottom: '1rem' }}>
      Visit our <a href='https://github.com/Joystream/helpdesk' target='_blank'>helpdesk</a>{' '}
      for instructions and guides to get started!
    </div>
    <Grid divided='vertically'>
      <Grid.Row columns={2}>
        <Grid.Column>{renderMemo(newsAccId)}</Grid.Column>
        <Grid.Column>{renderMemo(validatorsAccId)}</Grid.Column>
      </Grid.Row>
      <Grid.Row columns={2}>
        <Grid.Column>{renderMemo(electionsAccId)}</Grid.Column>
        <Grid.Column>{renderMemo(bugsAccId)}</Grid.Column>
      </Grid.Row>
    </Grid>
  </>);
};

export default translate(
  Component
);
