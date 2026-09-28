'use strict';
(() => {
  const form=document.getElementById('beta-form');
  const status=document.getElementById('apply-status');
  const allowedHosting=new Set(['n8n Cloud','Self-hosted n8n','Both']);
  const allowedDestinations=new Set([
    'GitHub issue or record','CRM record','Spreadsheet or database',
    'API result in another system','Other',
  ]);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const email=document.getElementById('email').value.trim();
    const hosting=document.getElementById('hosting').value;
    const destination=document.getElementById('destination').value;
    const example=document.getElementById('example').value.trim();
    const consent=document.getElementById('consent').checked;
    if(!form.reportValidity()||!consent||!allowedHosting.has(hosting)||
       !allowedDestinations.has(destination)||example.length>400){
      status.textContent='Please complete the required fields.';
      return;
    }
    // Email client only, no automatic form submission or third-party tracking.
    // Do not accept arbitrary URL or headers from untrusted inputs.
    const body=[
      'Hello Resultary,',
      '',
      "I'd like to apply for the invitation-only n8n private beta.",
      '',
      'Work email: '+email,
      'My n8n setup: '+hosting,
      'Independent result to verify: '+destination,
      'Use case (no credentials or customer data): '+(example||'Not supplied'),
      '',
      'I agree to be contacted about my n8n private-beta application.',
    ].join('\n');
    const href='mailto:support@getresultary.com?subject='+
      encodeURIComponent('Resultary n8n private beta application')+
      '&body='+encodeURIComponent(body);
    if(href.length>2200){
      status.textContent='The message is too long. Please shorten your use case.';
      return;
    }
    status.textContent='Your email app will open. Please send the prepared email to submit your application.';
    window.location.href=href;
  });
})();
