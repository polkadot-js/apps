
import React from 'react';
import { Grid } from 'semantic-ui-react';

import { I18nProps } from '@polkadot/ui-app/types';

// our app-specific styles
import './index.css';

// local imports and components
import translate from './translate';
import MemoView from '@polkadot/joy-utils/memo/MemoView';
import { Link } from 'react-router-dom';

const validatorsAccId = '5DULwvQcCCdEJzwp6rWdXESQSvPPZ5TL77b7DTSH8Jo6j6kP';
const electionsAccId = '5EE7QzS8MGvbjBAr9NpNrnY9fg5ACs5wcsmwZFQeYdoAXfrL';
const bugsAccId = '5Eeb3fU7FeQXpqvjDfzArWG4seTzB9TXVrXGybLr8SHAcFFL';
const newsAccId = '5ENParCsYNVp6CGMye3S2344rRuGCXL5gU3TwDkBD6FTDvu8';

type Props = I18nProps & {};

const renderMemo = (accId: string) => {
  return <>
    <MemoView accountId={accId} preview={false} />
    <em className='AccountId'>
      <span>Memo of account </span>
      <code><Link to={`/addresses/memo/${accId}`}>{accId}</Link></code>
    </em>
  </>;
};

export const Component = (_props: Props) => {
  return (
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
  );
};

export default translate(
  Component
);
