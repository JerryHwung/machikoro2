# PandaStack Deployment Guide

This guide explains how to deploy Machi Koro 2 to PandaStack for small casual
playtesting. It is written for the current split app:

- `client/`: Vite + React frontend
- `server/`: Express + Socket.IO backend
- multiplayer rooms and game state stored in server memory

PandaStack can be a reasonable free hosting option for light use, including
fewer than 10 casual users, if the app runs as one long-running containerized
Node web service. The current game also limits a single room to 5 players, so
the first production target should be one small room or a few small test rooms,
not a public launch.

## Current PandaStack Free Tier Notes

Check these pages before deploying because free-tier limits can change:

- PandaStack pricing: https://pandastack.io/pricing
- PandaStack quickstart: https://docs.pandastack.io/v1/getting-started/quickstart
- PandaStack limitations and pricing docs: https://docs.pandastack.io/v1/getting-started/limitations-and-pricing

As of the current checked docs:

- The pricing page lists a Free plan with `$0/mo`, `5 web services + 5 static
  websites`, `100 GB bandwidth / month`, and `300 build pipeline mins / month`.
- The compute pricing table lists the Free compute tier as `0.25 CPU` and
  `512 MB RAM`.
- The limitations docs list `1` static website, `1` web service, `100 GB`
  bandwidth, and `300` build minutes for the Free tier.

Because the pricing page and limitations docs disagree on the number of free
web services/static sites, use the conservative assumption: one free web
service is available. That is enough for the recommended deployment below.

## Recommended Shape

Deploy one PandaStack containerized web service that serves both:

- the built React files from `client/dist`
- the Socket.IO server from the same origin

This is better than deploying a separate static site plus backend for the first
production attempt because:

- the browser can connect to Socket.IO at the same HTTPS origin
- no `VITE_SOCKET_URL` production override is needed
- CORS is simpler
- one free web service is enough
- Socket.IO avoids cross-domain WebSocket setup issues

Do not deploy multiple replicas yet. Rooms and game state are currently stored
in the memory of one Node process, so multiple replicas would split players
across different server instances unless shared state and sticky routing are
added later.

## Pre-Deploy Requirements

This repo includes the production support needed for the PandaStack steps:

1. Root production `Dockerfile`.
   - Builds `client/` with `npm ci` and `npm run build`.
   - Installs production dependencies for `server/`.
   - Copies `client/dist` into the runtime image.
   - Starts the backend with `npm start`.

2. Server port binding.
   - Uses `process.env.PORT || 3001`.
   - Binds to `0.0.0.0`.
   - This lets PandaStack provide the public runtime port while local fallback
     still works.

3. Health endpoint.
   - `GET /health` returns HTTP `200` with `ok`.
   - Use this as the PandaStack health check path.

4. React production build serving from Express.
   - Serves static assets from `client/dist` when that folder exists.
   - Adds an SPA fallback that returns `client/dist/index.html`.
   - Keeps Socket.IO routes outside the static fallback.

5. Production Socket.IO URL behavior.
   - Keeps `VITE_SOCKET_URL` as an explicit override.
   - In production, defaults to `window.location.origin`.
   - In local dev, continues using `window.location.hostname:3001`.

6. Run one replica only.
   - Keep autoscaling disabled for now.
   - Add Redis or database-backed room/session state before enabling multiple
     replicas.

## PandaStack Dashboard Steps

1. Push this repository to GitHub.

2. Create or sign in to PandaStack.
   - Open https://dashboard.pandastack.io.
   - Create an account with email, Google, or GitHub.
   - Create or select an organization.
   - Select the Free plan if you are testing the free deployment path.

3. Create a new project or service.
   - Choose the option for a containerized application, web service, or project
     container.
   - Connect your GitHub account if PandaStack has not been connected yet.
   - Select the `machikoro2` repository.
   - Select the branch to deploy, usually `main`.

4. Configure the build.
   - Build type: Docker or containerized app.
   - Build context/root: repository root.
   - Dockerfile path: `Dockerfile`.
   - Build command: leave empty if PandaStack builds from the Dockerfile.
   - Start command: leave empty if the Dockerfile defines `CMD`.

5. Configure runtime resources.
   - Compute tier: Free.
   - Expected free compute size: `0.25 CPU / 512 MB RAM`.
   - Instance count: `1`.
   - Autoscaling: disabled.
   - Public access: enabled.

6. Configure ports.
   - The app should read `process.env.PORT`.
   - If PandaStack asks for an exposed/container port, use the port from the
     production Dockerfile.
   - If a fixed fallback is required, use `3001`.

7. Configure environment variables.
   - `NODE_ENV=production`
   - Do not set `VITE_SOCKET_URL` for the recommended single-service deploy.
   - Optional later: add `CORS_ORIGIN=https://your-pandastack-domain` if the
     server is changed to restrict CORS.

8. Configure health checks.
   - Health check path: `/health`
   - Expected result: HTTP `200`

9. Deploy.
   - Start the deployment from the PandaStack dashboard.
   - Watch the build logs until the image builds successfully.
   - Watch runtime logs until the server starts and listens on the configured
     port.

## Post-Deploy Verification

After PandaStack gives you the public HTTPS URL:

1. Open `https://your-pandastack-domain/health`.
   - Expected: HTTP `200` with a simple OK response.

2. Open `https://your-pandastack-domain/`.
   - Expected: the React app loads over HTTPS.

3. Create a room in one browser tab.
   - Expected: room code appears and the host is listed.

4. Join from a second browser tab or private window.
   - Expected: the second player joins the same room.

5. Join from a phone.
   - Use the public PandaStack URL, not a local IP address.
   - Test from Wi-Fi and, if possible, from mobile data.

6. Start a game and complete one basic turn.
   - Expected: both clients receive the same game state after the action.

7. Check PandaStack logs.
   - Confirm there are no repeated restarts.
   - Confirm there are no Socket.IO connection errors.
   - Watch memory and CPU if PandaStack exposes those metrics on the Free plan.

## Troubleshooting

### Build Fails

- Confirm the root production `Dockerfile` exists.
- Confirm the Dockerfile builds from the repository root.
- Confirm it installs dependencies separately for `client/` and `server/`.
- Confirm `client/package-lock.json` and `server/package-lock.json` are present
  if the Dockerfile uses `npm ci`.
- Rebuild locally before retrying on PandaStack.

### Service Starts Locally But Not On PandaStack

- Confirm the server uses `process.env.PORT || 3001`.
- Confirm the server binds to `0.0.0.0`, not `localhost`.
- Confirm the Dockerfile exposes the same fallback port used by the server.
- Check runtime logs for port binding errors.

### App Loads But Socket.IO Does Not Connect

- Open browser DevTools and check the Network tab for `/socket.io/` requests.
- If the app is deployed as one service, the Socket.IO URL should be the same
  origin as the page.
- Do not set `VITE_SOCKET_URL` unless you intentionally split frontend and
  backend hosting.
- Confirm PandaStack is serving the app over HTTPS and the browser is not trying
  to connect to an insecure `ws://` URL.

### App Loads But Room Join Fails

- Confirm both players are using the same public PandaStack URL.
- Confirm there is only one running replica.
- Check server logs for `room:join` errors such as `Room not found`, `Room is
  full`, or `Game already started`.
- Remember that the current room limit is 5 players.

### Games Disappear After Restart

This is expected with the current architecture. Rooms and game state live in
server memory. A restart, redeploy, crash, or scale event clears active games.

For persistence, add shared storage later, such as Redis or a database. For
multiple replicas, add a Socket.IO adapter and shared room/game state first.

### Free Tier Feels Slow Or Unstable

- Keep the first test to fewer than 10 casual users.
- Keep one replica.
- Watch CPU and memory if metrics are available.
- Upgrade to a paid compute tier, such as `1 CPU / 2 GB RAM`, if the free tier
  cannot keep up.

## Upgrade Path

Use the free single-service deployment for testing and demos. Before broader
use, plan these upgrades:

1. Keep production Docker and same-origin serving verified.
2. Restrict CORS to the deployed domain.
3. Add Redis or database-backed room/game state.
4. Add a Socket.IO adapter before multiple replicas.
5. Move to paid compute if CPU/RAM is too small.
6. Add a custom domain and monitor logs/health checks.
