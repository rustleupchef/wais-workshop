# CLAUDE.md

## Project Overview
Static website that communicates with Google APIs through a Cloudflare Worker as a proxy/middleware layer.

## Architecture
- `/` — working directory contains all the html files
- `/static` — contains folders that contain all the javascript and css for the html pages 

## How It Works
1. Frontend makes requests to the Cloudflare Worker URL
2. Worker authenticates and forwards requests to the Google API
3. Worker returns the response to the frontend

## Commands
- Preview site: open `index.html` in browser

## Conventions
- All Google API calls go through the worker — never call Google APIs directly from the frontend
- Keep the worker stateless
- Use `fetch()` on the frontend to call the worker endpoint
- Store no secrets in frontend code or the repo