# n8n-nodes-resultary

Official community node for [Resultary](https://getresultary.com/), an outcome-verification layer for automations.

## What it does

Resultary helps distinguish "the workflow ran" from "the intended business result actually happened."

The node currently provides three operations:

- **Send Run Signal** — automatically sends the current n8n execution ID and workflow ID to Resultary.
- **Verify Connection** — checks the Resultary connection without creating a business run.
- **Get Run Status** — reads the current Resultary status for a run.

## Authentication

The Resultary credential uses **OAuth 2.0 with PKCE (S256)**.

You do not need to copy an API key or create a client secret. After starting a Resultary trial or subscription, choose **Connect Resultary** in n8n and authorize the connection in your browser.

The initial release targets **n8n Cloud**. The OAuth callback is intentionally restricted to n8n Cloud while the integration is being validated.

## Quick start

1. Start your Resultary trial at [getresultary.com](https://getresultary.com/).
2. Add the **Resultary** node to an n8n workflow.
3. Create a new **Resultary OAuth2 API** credential and choose **Connect**.
4. Select **Verify Connection** to confirm authentication, or **Send Run Signal** to attach Resultary to a workflow.
5. View Resultary status and independent proof results in your Resultary dashboard.

## Send Run Signal

**Send Run Signal** requires no IDs to be entered manually. The node reads the current n8n execution ID and workflow ID from n8n and sends them to Resultary.

A successful run signal means Resultary received the workflow execution. It does **not** by itself prove that the downstream business result occurred. Resultary reports Healthy, Incident, or Recovery only when an independent proof source is configured.

## Security

- OAuth authorization uses PKCE S256.
- No confidential OAuth client secret is embedded in the package.
- Access is tied to an active Resultary trial or subscription.
- Resultary access tokens are stored by n8n as credentials and are not embedded in exported workflow JSON.
- The node has no runtime dependencies and does not access environment variables or the filesystem.

## Development

```bash
npm install
npm run build
npm run lint
```

This package is built with the official `@n8n/node-cli` and is intended to meet n8n verified-community-node requirements.

## Support

- Product: https://getresultary.com/
- n8n setup: https://getresultary.com/n8n/
- Issues: https://github.com/PharmedAI/resultary-site/issues

## License

MIT
