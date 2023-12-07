## Stan Server and Client over WS (bare metal)

```bash
# To get started, please clone this repo and please install nvm if not on system already :)
nvm use

# Install deps
npm ci

# lets run a check before we even start, this runs formatting, runs type checking and tests
npm run full-check

# previous command should be green, this will this will create the bundle we need to get started
npm run createBundle

# now lets start the server
npm run start-server

# in a new tab, please run the client
npm run start-client

# The ports should display on standard out, please go to the browser http://localhost:8080 for client
# This should automatically connect to server over WS and should start receiving the movie posters
```
