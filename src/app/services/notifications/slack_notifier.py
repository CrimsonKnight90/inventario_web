import json
from typing import Sequence, Mapping, Any

import httpx


async def send_slack_alert(webhook_url: str, alerts: Sequence[Mapping[str, Any]]) -> None:
    """Send alerts to Slack via Incoming Webhook.

    Args:
        webhook_url: Slack Incoming Webhook URL.
        alerts: A list of alert dictionaries (type, message, optional metadata).

    Raises:
        httpx.HTTPError: If the POST request fails.
        ValueError: If webhook_url is empty or alerts are empty.
    """
    if not webhook_url:
        raise ValueError("Slack webhook URL not configured")
    if not alerts:
        raise ValueError("No alerts to send")

    # Build a readable Slack message using Block Kit text section
    lines = [f":rotating_light: *Inventory Alerts* ({len(alerts)})"]
    for a in alerts:
        lines.append(f"- `{a.get('type')}`: {a.get('message')}")

    payload = {
        "text": "\n".join(lines),
        "blocks": [
            {
                "type": "section",
                "text": {"type": "mrkdwn", "text": "\n".join(lines)},
            }
        ],
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.post(webhook_url, content=json.dumps(payload))
        resp.raise_for_status()
