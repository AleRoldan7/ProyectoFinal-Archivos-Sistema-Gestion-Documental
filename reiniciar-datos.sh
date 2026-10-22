#!/usr/bin/env bash
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")" && pwd)"
cd "$RAIZ/backend"
npm run seed:reset