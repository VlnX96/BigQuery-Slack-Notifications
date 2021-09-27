import cron from 'node-cron';
import { BigQuery } from '@google-cloud/bigquery';
import axios from 'axios';
import token from './slackToken.mjs'

let date = new Date();
let day = (date.getDate());
let month = (date.getUTCMonth() + 1);
let year = (date.getFullYear());
let yesterdaysDate = `${year}0${month}${day - 1}`;
let yesterdaysDate2 = `${year}${month}${day - 1}`;

function chooseDate() {
  if (month < 10) {
    var sqlDate = yesterdaysDate
  } else {
    var sqlDate = yesterdaysDate2
  }
  return sqlDate;
};

cron.schedule('* * * * * ', () => {
  console.log('analytics sent!');
  queryStackOverflow();
});

async function queryStackOverflow() {

  const bigqueryClient = new BigQuery();
  const noResultQuery = `SELECT
SUM(CASE WHEN event_name = 'no_result' then 1 else 0 end ) AS no_result,
SUM(CASE WHEN event_name = 'first_open' then 1 else 0 end ) AS first_open,
SUM(CASE WHEN event_name = 'result_found' then 1 else 0 end ) AS result_found,
SUM(CASE WHEN event_name = 'account_created' then 1 else 0 end ) AS account_created,
SUM(CASE WHEN event_name = 'session_start' then 1 else 0 end ) AS session_start,
FROM \`auto-key-mobile.analytics_270509349.events_${chooseDate()}\`
LIMIT 100;`;

  const noResult = {
    query: noResultQuery,
    location: 'US',
  };

  const [rows] = await bigqueryClient.query(noResult);
  let noResultCount = rows[0].no_result;
  let firstOpenCount = rows[0].first_open;
  let resultFoundCount = rows[0].result_found;
  let accountCreatedCount = rows[0].account_created;
  let sessionStartCount = rows[0].session_start;

  const slackToken = token.token;

  const url = 'https://slack.com/api/chat.postMessage';
  const res = await axios.post(url, {
    channel: 'test-slack-messages',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Yesterday\'s key analytics:'
        }
      },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*First Opens* : *${firstOpenCount}*`
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Sessions Started* : *${sessionStartCount}*`
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Accounts Created* : *${accountCreatedCount}*`
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Results Found* : *${resultFoundCount}*`
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*No Results* : *${noResultCount}*`
      }
    }
  ],
    username: ' ͟ ͟A͟u͟t͟o͟-͟K͟e͟y͟ ͟A͟n͟a͟l͟y͟t͟i͟c͟s͟',
    icon_emoji: ':dizzy:'
  }, { headers: { authorization: `Bearer ${slackToken}` } });
};

