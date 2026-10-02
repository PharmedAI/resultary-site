import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const page=readFileSync(new URL('./index.html',import.meta.url),'utf8');
const integration=readFileSync(new URL('../integrations/index.html',import.meta.url),'utf8');
const homepage=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const chooser=readFileSync(new URL('../start/index.html',import.meta.url),'utf8');
const sitemap=readFileSync(new URL('../sitemap.xml',import.meta.url),'utf8');
const trial='https://api.getresultary.com/private/n8n/start';

test('n8n landing exposes a direct honest self-service trial with no invitation friction',()=>{
  assert.match(page,/Start 15-day free trial/);
  assert.ok(page.includes('href="'+trial+'"'));
  assert.match(page,/\$29\/month after the trial/i);
  assert.match(page,/Payment method required/i);
  assert.match(page,/published on npm/i);
  assert.match(page,/n8n Cloud verification is in progress/i);
  assert.doesNotMatch(page,/Apply for private beta|Invitation required|Paste your invitation|id="apply"|id="beta-form"/i);
  assert.match(page,/Use test data during first setup/i);
  assert.match(page,/href="\/privacy\//);
  assert.doesNotMatch(page,/Guaranteed ROI|certified now|instant activation/i);
});

test('site-wide n8n conversion links lead directly to the self-service trial',()=>{
  assert.ok(integration.includes('href="'+trial+'"'));
  assert.ok(homepage.includes('href="'+trial+'"'));
  assert.ok(chooser.includes('href="'+trial+'"'));
  assert.match(integration,/SELF-SERVICE TRIAL/);
  assert.match(homepage,/SELF-SERVICE BETA/);
  assert.match(chooser,/15-day free trial/);
  assert.match(sitemap,/<loc>https:\/\/getresultary\.com\/n8n\/<\/loc>/);
});

test('manual starter remains available only as a temporary fallback',()=>{
  const workflow=JSON.parse(readFileSync(new URL('./resultary-n8n-starter.json',import.meta.url),'utf8'));
  assert.match(page,/href="\/n8n\/resultary-n8n-starter.json"/);
  assert.match(page,/Temporary beta setup fallback/);
  assert.match(page,/Most users should start the trial first/);
  assert.equal(workflow.active,false);
  assert.ok(workflow.nodes.some(node=>node.type==='n8n-nodes-base.httpRequest'));
  assert.ok(workflow.nodes.filter(node=>node.type==='n8n-nodes-base.httpRequest')
    .every(node=>node.parameters.url.includes('REPLACE_WITH_YOUR_PRIVATE_RESULTARY_HOST')));
  assert.ok(workflow.nodes.every(node=>!node.credentials));
  assert.match(JSON.stringify(workflow),/self-service trial first/i);
  assert.doesNotMatch(JSON.stringify(workflow),/Bearer [A-Za-z0-9]{20,}|github_pat_/);
});

test('Get started keeps Jira and n8n as separate explicit choices',()=>{
  assert.match(homepage,/href="\/start\/" class="nav-cta">Get started/);
  assert.match(integration,/href="\/start\/" class="nav-cta">Get started/);
  assert.match(chooser,/href="\/product\/">Get started with Jira/);
  assert.ok(chooser.includes('href="'+trial+'"'));
  assert.match(chooser,/href="\/n8n\/">View n8n setup/);
  assert.match(sitemap,/<loc>https:\/\/getresultary\.com\/start\/<\/loc>/);
});

test('n8n troubleshooting guides remain actionable and now link to the live beta trial',()=>{
  const guide=readFileSync(new URL('./workflow-success-no-result/index.html',import.meta.url),'utf8');
  const monitor=readFileSync(new URL('./monitor-workflows/index.html',import.meta.url),'utf8');
  assert.match(guide,/Inspect the actual execution path/);
  assert.match(guide,/Check the destination directly/);
  assert.match(guide,/delayed results and transient errors/);
  assert.ok(guide.includes('href="'+trial+'"'));
  assert.ok(monitor.includes('href="'+trial+'"'));
  assert.match(monitor,/missing execution signal/);
  assert.match(monitor,/not independent proof/);
  assert.match(monitor,/technically uncertain/);
});
