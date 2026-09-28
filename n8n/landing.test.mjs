import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('./index.html',import.meta.url),'utf8');
const script=readFileSync(new URL('./apply.js',import.meta.url),'utf8');
const integration=readFileSync(new URL('../integrations/index.html',import.meta.url),'utf8');
test('n8n landing clearly marks availability and provides honest application',()=>{
  assert.match(page,/invitation-only n8n beta is in development/i);
  assert.match(page,/not yet deployed/i);
  assert.match(page,/not yet published or certified/i);
  assert.match(page,/mailto|opens your email app/i);
  assert.match(page,/id="consent"/);
  assert.match(page,/required/);
  assert.match(page,/href="\/privacy\//);
  assert.match(integration,/href="\/n8n\/"[^>]*>Apply for n8n beta/);
  assert.doesNotMatch(page,/Guaranteed ROI|certified now|instant activation/i);
});
test('email application is explicitly user submitted and contains no covert tracking',()=>{
  assert.match(script,/mailto:support@getresultary\.com/);
  assert.match(script,/window\.location\.href=href/);
  assert.match(script,/!consent/);
  assert.match(script,/no automatic form submission/i);
  assert.doesNotMatch(script,/fetch\(|XMLHttpRequest|localStorage|sessionStorage|innerHTML|analytics/);
  assert.doesNotMatch(script,/client_secret|api_token/);
});
