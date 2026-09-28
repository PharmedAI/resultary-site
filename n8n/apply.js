'use strict';
(() => {
  const form = document.getElementById('beta-form');
  const status = document.getElementById('apply-status');
  const copyButton = document.getElementById('copy-application');
  const allowedHosting = new Set(['n8n Cloud', 'Self-hosted n8n', 'Both']);
  const allowedDestinations = new Set([
    'GitHub issue or record', 'CRM record', 'Spreadsheet or database',
    'API result in another system', 'Other',
  ]);

  function buildApplication() {
    const email = document.getElementById('email').value.trim();
    const hosting = document.getElementById('hosting').value;
    const destination = document.getElementById('destination').value;
    const example = document.getElementById('example').value.trim();
    const consent = document.getElementById('consent').checked;
    if (!form.reportValidity() || !consent ||
        (hosting && !allowedHosting.has(hosting)) ||
        (destination && !allowedDestinations.has(destination)) ||
        example.length > 400) {
      status.textContent = 'Please enter your work email and agree to be contacted.';
      return null;
    }
    // No credentials, customer data, or opaque tracking is intentionally collected.
    return [
      'Hello Resultary', '',
      "I'd like to apply for the invitation-only n8n private beta.", '',
      'Work email: ' + email,
      'My n8n setup: ' + (hosting || 'To be discussed'),
      'Independent result to verify: ' + (destination || 'To be discussed'),
      'Use case (no credentials or customer data): ' + (example || 'Not supplied'),
      '', 'I agree to be contacted about my n8n private-beta application.',
    ].join('\n');
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const body = buildApplication();
    if (!body) return;
    // Mail client only; there is no automatic form submission or third-party tracking.
    const href = 'mailto:support@getresultary.com?subject=' +
      encodeURIComponent('Resultary n8n private beta application') +
      '&body=' + encodeURIComponent(body);
    if (href.length > 2200) {
      status.textContent = 'The message is too long. Please shorten your use case.';
      return;
    }
    status.textContent = 'Your email app will open. Please send the prepared email to apply.';
    window.location.href = href;
  });

  copyButton.addEventListener('click', async () => {
    const body = buildApplication();
    if (!body) return;
    // Clipboard only on explicit click and supported secure origins.
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(
        'To: support@getresultary.com\nSubject: Resultary n8n private beta application\n\n' + body
      );
      status.textContent = 'Copied. Paste into your email app and send to support@getresultary.com.';
    } catch {
      status.textContent = 'Clipboard unavailable. Try Open email application or email support@getresultary.com.';
    }
  });
})();
