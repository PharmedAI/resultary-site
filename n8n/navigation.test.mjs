import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const pages=[
  'index.html','n8n/index.html','start/index.html',
  'product/index.html','integrations/index.html','trust/index.html',
  'docs/index.html','faq/index.html','support/index.html',
  'security/index.html','privacy/index.html','terms/index.html','404.html',
];
const navLinks=[
  ['Home','/'],['For Jira','/product/'],['For n8n','/n8n/'],
  ['Integrations','/integrations/'],['Get started','/start/'],
];
const pageHtml=path=>readFileSync(resolve(root,path),'utf8');
const primary=html=>html.match(/<nav aria-label="Primary navigation">([\s\S]*?)<\/nav>/)?.[1];

test('every public page shares the same five product-switching navigation links',()=>{
  for(const page of pages){
    const html=pageHtml(page),header=primary(html);
    assert.ok(header,'missing primary navigation: '+page);
    const links=[...header.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)]
      .map(m=>({href:m[1],label:m[2].replace(/<[^>]*>/g,'').trim()}));
    assert.deepEqual(links,navLinks.map(([label,href])=>({label,href})),page);
    assert.match(html,/<a class="brand" href="\/" aria-label="Resultary home">/,page);
    assert.match(html,/<nav class="edition-footer-links" aria-label="Navigate between Resultary editions">/,page);
    for(const [,href] of navLinks){
      const local=resolve(root,href.slice(1),'index.html');
      assert.ok(existsSync(local),'invalid navigation target '+href+' from '+page);
    }
    for(const href of ['/','/product/','/n8n/','/start/']){
      const footer=html.match(/<nav class="edition-footer-links"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
      assert.ok(footer?.includes('href="'+href+'"'),'missing footer cross-link '+href+' in '+page);
    }
  }
});
test('product pages make it possible to move between Jira and n8n without relying on browser back',()=>{
  const jira=pageHtml('product/index.html'),n8n=pageHtml('n8n/index.html');
  const jiraSwitch=jira.match(/<div class="edition-subnav"[^>]*>([\s\S]*?)<\/div>/)?.[1];
  const n8nSwitch=n8n.match(/<div class="edition-subnav"[^>]*>([\s\S]*?)<\/div>/)?.[1];
  assert.match(jiraSwitch??'',/href="\/n8n\/">Switch to n8n/);
  assert.match(n8nSwitch??'',/href="\/product\/">Switch to Jira/);
  assert.match(n8nSwitch??'',/href="\/start\/">← All editions/);
  assert.match(n8nSwitch??'',/href="#install">Download starter/);
  assert.match(n8nSwitch??'',/href="#apply">n8n private beta/);
  assert.match(n8n,/id="install"/);
  assert.match(n8n,/id="apply"/);
  assert.match(jira,/<a class="brand" href="\/" aria-label="Resultary home">/);
  assert.match(n8n,/<a class="brand" href="\/" aria-label="Resultary home">/);
});

test('responsive CSS keeps Jira, n8n and return navigation visible even on mobile',()=>{
  const modern=pageHtml('site-v2.css');
  const legacy=pageHtml('styles.css');
  assert.match(legacy,/nav a:not\(\.nav-cta\)\{display:none\}/);
  assert.match(modern,/\.site-v2 \.site-header \.v2-nav nav a:not\(\.nav-cta\)\{display:inline-flex!important\}/);
  assert.match(modern,/\.site-v2 \.edition-footer-links a:not\(\.nav-cta\)\{display:inline-flex!important\}/);
  for(const page of pages)assert.match(pageHtml(page),/site-v2(?:\.css|"| )/,page);
});
