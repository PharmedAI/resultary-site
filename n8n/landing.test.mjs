import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const page=readFileSync(new URL('./index.html',import.meta.url),'utf8');
const script=readFileSync(new URL('./apply.js',import.meta.url),'utf8');
const integration=readFileSync(new URL('../integrations/index.html',import.meta.url),'utf8');
const homepage=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const sitemap=readFileSync(new URL('../sitemap.xml',import.meta.url),'utf8');
test('n8n landing clearly marks availability and provides honest application',()=>{
  assert.match(page,/applications for a limited private beta are open/i);
  assert.match(page,/not yet deployed/i);
  assert.match(page,/not yet published or certified/i);
  assert.match(page,/mailto|opens your email app/i);
  assert.match(page,/id="consent"/);
  assert.match(page,/required/);
  assert.match(page,/href="\/privacy\//);
  assert.match(integration,/href="\/n8n\/"[^>]*>Apply for n8n beta/);
  assert.match(homepage,/href="\/n8n\/demo\/" class="v2-platform-link">See n8n 30-second example/);
  assert.match(homepage,/href="\/n8n\/resultary-n8n-starter.json" download="resultary-n8n-starter.json" class="v2-platform-link">Download free n8n starter JSON/);
  assert.match(homepage,/Download free n8n starter JSON/);
  assert.match(sitemap,/<loc>https:\/\/getresultary\.com\/n8n\/<\/loc>/);
  assert.doesNotMatch(page,/Guaranteed ROI|certified now|instant activation/i);
});
test('email application is explicitly user submitted and contains no covert tracking',()=>{
  assert.match(script,/mailto:support@getresultary\.com/);
  assert.match(script,/window\.location\.href\s*=\s*href/);
  assert.match(script,/!consent/);
  assert.match(script,/no automatic form submission/i);
  assert.doesNotMatch(script,/fetch\(|XMLHttpRequest|localStorage|sessionStorage|innerHTML|analytics/);
  assert.doesNotMatch(script,/client_secret|api_token/);
});

test('separate n8n page offers an honest direct credential-free download',()=>{
  const workflow=JSON.parse(readFileSync(new URL('./resultary-n8n-starter.json',import.meta.url),'utf8'));
  assert.match(page,/href="\/n8n\/resultary-n8n-starter.json"/);
  assert.match(page,/Public self-service activation is not live yet/);
  assert.match(page,/importable template, not an installed or activated application/);
  assert.match(homepage,/>For Jira<\/a><a href="\/n8n\/">For n8n<\/a>/);
  assert.match(page,/<nav aria-label="Primary navigation">[^]*href="\/product\/">For Jira/);
  assert.match(page,/<a class="brand" href="\/" aria-label="Resultary home">/);
  assert.equal(workflow.active,false);
  assert.ok(workflow.nodes.some(node=>node.type==='n8n-nodes-base.httpRequest'));
  assert.ok(workflow.nodes.filter(node=>node.type==='n8n-nodes-base.httpRequest').every(node=>node.parameters.url.includes('REPLACE_WITH_YOUR_PRIVATE_RESULTARY_HOST')));
  assert.ok(workflow.nodes.every(node=>!node.credentials));
  assert.doesNotMatch(JSON.stringify(workflow),/Bearer [A-Za-z0-9]{20,}|github_pat_/);
});

test('Get started chooses the right edition rather than silently redirecting to Jira',()=>{
  const chooser=readFileSync(new URL('../start/index.html',import.meta.url),'utf8');
  assert.match(homepage,/href="\/start\/" class="nav-cta">Get started/);
  assert.match(integration,/href="\/start\/" class="nav-cta">Get started/);
  assert.match(chooser,/href="\/product\/">Get started with Jira/);
  assert.match(chooser,/href="\/n8n\/resultary-n8n-starter.json" download/);
  assert.match(chooser,/href="\/n8n\/">View n8n setup/);
  assert.match(chooser,/inactive, unconfigured workflow template/);
  assert.match(sitemap,/<loc>https:\/\/getresultary\.com\/start\/<\/loc>/);
});

test('targeted SEO troubleshooting guide offers actionable value without claiming live n8n SaaS',()=>{
  const guide=readFileSync(new URL('./workflow-success-no-result/index.html',import.meta.url),'utf8');
  assert.match(page,/href="\/n8n\/workflow-success-no-result\/"/);
  assert.match(sitemap,/https:\/\/getresultary\.com\/n8n\/workflow-success-no-result\//);
  assert.match(guide,/Inspect the actual execution path/);
  assert.match(guide,/Check the destination directly/);
  assert.match(guide,/delayed results and transient errors/);
  assert.match(guide,/Missing scheduled execution signal/i);
  assert.match(guide,/href="\/n8n\/demo\/"/);
  assert.match(guide,/href="\/n8n\/#apply"/);
  assert.match(guide,/not publicly available yet/);
  assert.match(guide,/href="\/product\/">For Jira/);
});

test('low-friction beta application has optional qualification and copy fallback', () => {
  assert.match(page, /id="email" type="email" required/);
  assert.match(page, /id="consent" type="checkbox" required/);
  assert.match(page, /id="hosting"><option value="">Not sure yet/);
  assert.match(page, /id="destination"><option value="">Not sure yet/);
  assert.match(page, /id="copy-application"/);
  assert.match(script, /navigator\.clipboard\?\.writeText/);
  assert.match(script, /support@getresultary\.com/);
  assert.doesNotMatch(script, /fetch\(|XMLHttpRequest|localStorage|sessionStorage|innerHTML/);
});

test('new n8n monitoring guide is linked, indexed and honest',()=>{
 const guide=readFileSync(new URL('./monitor-workflows/index.html',import.meta.url),'utf8');
 assert.match(page,/href="\/n8n\/monitor-workflows\/"/);
 assert.match(sitemap,/https:\/\/getresultary\.com\/n8n\/monitor-workflows\//);
 assert.match(guide,/missing execution signal/);
 assert.match(guide,/not independent proof/);
 assert.match(guide,/technically uncertain/);
 assert.match(guide,/href="\/n8n\/demo\/"/);
 assert.match(guide,/not yet available/);
});
