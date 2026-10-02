import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('./demo/index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('./demo/demo.js',import.meta.url),'utf8');
const landing=readFileSync(new URL('./index.html',import.meta.url),'utf8');
const home=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const sitemap=readFileSync(new URL('../sitemap.xml',import.meta.url),'utf8');

test('n8n visitor can understand the result before signup with a no-data 30-second example',()=>{
  assert.match(landing,/href="\/n8n\/demo\/"/);
  assert.match(home,/href="\/n8n\/demo\/"/);
  assert.match(sitemap,/https:\/\/getresultary\.com\/n8n\/demo\//);
  assert.match(html,/Illustrative simulation only/);
  assert.match(html,/not live product results/);
  assert.match(html,/href="https:\/\/api\.getresultary\.com\/private\/n8n\/start"/);
  assert.match(html,/href="\/n8n\/resultary-n8n-starter.json"/);
  assert.match(html,/href="\/product\/">For Jira/);
  assert.match(html,/href="\/n8n\/">← n8n edition/);
  assert.match(html,/self-service beta/i);
  assert.match(html,/\$29\/month/);
  assert.doesNotMatch(html,/invitation-only|Apply for the private n8n beta/i);
  assert.match(html,/No account needed/);
});
test('fictional states distinguish missing business outcome from missing transport signal',()=>{
  assert.match(html,/data-scenario="pending"/);
  assert.match(html,/data-scenario="missing"/);
  assert.match(html,/data-scenario="recovered"/);
  assert.match(js,/did not contain the expected record/);
  assert.match(js,/not merely a missing run signal/);
  assert.match(js,/independent destination read later finds/);
  assert.match(js,/aria-pressed/);
  assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|navigator\.sendBeacon|localStorage|sessionStorage|document\.cookie|innerHTML/);
});
