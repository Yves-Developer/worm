# Wormkey CLI Reference

Full reference for the Wormkey command-line interface.

---

## Commands

### `wormkey http <port>`

Expose a local port via a public wormhole URL.

```bash
wormkey http 3000
wormkey http 5173 --expires 2h
wormkey http 8080 --auth
```

| Option | Description | Default |
|--------|-------------|---------|
| `--auth` | Enable basic auth (prints username/password) | off |
| `--expires <duration>` | Tunnel lifetime (e.g. `30m`, `1h`, `24h`) | `24h` |
| `--control-plane <url>` | Override control plane URL | env or production |
| `--edge <url>` | Override edge tunnel WebSocket URL | env or production |
| `--local` | Use localhost control plane and edge | off |

**Interactive shortcuts** (when stdin is a TTY):

| Key | Action |
|-----|--------|
| L | Open share URL in default browser |
| C | Copy share URL to clipboard |
| P | Pause tunnel (new requests return 503) |
| R | Resume tunnel |
| Q | Close tunnel and exit |

---

### `wormkey status`

Show the active tunnel's status. Reads from `~/.wormkey/p.json`.

```bash
wormkey status
```

**Output (when tunnel is running):**

```
Tunnel: running
URL: https://t.wormkey.run/s/demo
Viewers: 3
Uptime: 1h 22m
```

**Output (when no tunnel):**

```
No active tunnel.
```

---

### `wormkey login`

Authenticate with Wormkey (device flow). Not implemented in v0.

---

### `wormkey close`

Close active tunnel. Not implemented in v0—use Ctrl+C on the tunnel process.

---

## Environment

| Variable | Description |
|----------|-------------|
| `WORMKEY_CONTROL_PLANE_URL` | Control plane API base URL |
| `WORMKEY_EDGE_URL` | Edge gateway WebSocket URL (e.g. `ws://localhost:3002/tunnel`) |
| `WORMKEY_ENV=local` | Shorthand for localhost control plane + edge |
| `XDG_STATE_HOME` | Override session state directory (default: `~/.wormkey`) |

---

## Session State

When a tunnel starts, the CLI writes to `~/.wormkey/p.json` (or `$XDG_STATE_HOME/wormkey/p.json`):

```json
{
  "slug": "demo",
  "controlPlaneUrl": "https://...",
  "publicUrl": "https://t.wormkey.run/s/demo",
  "startedAt": "2025-03-01T12:00:00.000Z"
}
```

This file is used by `wormkey status` and is deleted when the tunnel closes.

---

## Examples

**Quick share (24h default):**
```bash
wormkey http 3000
```

**Short demo (30 minutes):**
```bash
wormkey http 3000 --expires 30m
```

**Protected tunnel:**
```bash
wormkey http 3000 --auth
```

**Local development:**
```bash
WORMKEY_CONTROL_PLANE_URL=http://localhost:3001 WORMKEY_EDGE_URL=ws://localhost:3002/tunnel wormkey http 3000
# or
wormkey http 3000 --local
```
