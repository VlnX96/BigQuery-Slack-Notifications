import cron from 'node-cron';
import { BigQuery } from '@google-cloud/bigquery';
import axios from 'axios';
import token from './slackToken.mjs'

let date = new Date();
let day = (date.getDate());
let dateString = new Date(date-86400000).toUTCString();
let day2 = (dateString.charAt(5)+dateString.charAt(6));
let month = (date.getMonth() + 1);
let year = (dateString.charAt(12)+dateString.charAt(13)+dateString.charAt(14)+dateString.charAt(15));
let yesterdaysDate = `${year}0${month}${day2}`;
let yesterdaysDate2 = `${year}${month}${day2}`;
let yesterdaysDate3 = `${year}0${month - 1}${day2}`;
let yesterdaysDate4 = `${year}${month - 1}${day2}`;

// chooses a "yesterdaysDate" variable based on the given month
function pickdate() {
  if (month < 10) {
    var sqlDate = yesterdaysDate
  } else {
    var sqlDate = yesterdaysDate2
  }
  return sqlDate;
};

// created to account for an edge case I noticed
function pickdate2() {
  if ((month = 10) && (day = 1)) {
    var sqlDate2 = yesterdaysDate3
  } else if (month < 10) { 
    var sqlDate2 = yesterdaysDate3;
  } else {
    var sqlDate2 = yesterdaysDate4;
  }
  return sqlDate2;
};

// chooses a "pickDate" based on whether it is the first calendar day of a given month or not
function constructDate() {
  if (day != 1) {
   var sqlDate3 = pickdate();
  } else {
    var sqlDate3 = pickdate2();
  }
  return sqlDate3
};

cron.schedule('* * * * * ', () => {
  console.log('analytics sent!!!!!');
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
FROM \`auto-key-mobile.analytics_270509349.events_${constructDate()}\`
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
    channel: 'test-channel-2',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Yesterday\'s key metrics:'
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
    username: ' ͟ ͟A͟u͟t͟o͟-͟K͟e͟y͟ ͟M͟e͟t͟r͟i͟c͟s͟͟',
    icon_emoji: ':metrics:'
  }, { headers: { authorization: `Bearer ${slackToken}` } });
};

