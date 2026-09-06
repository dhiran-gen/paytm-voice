#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT/backend"
FRONTEND_DIR="$ROOT/frontend"
VENV_DIR="$BACKEND_DIR/.venv"
PIDFILE="$ROOT/.start_pids"

usage() {
  echo "Usage: $0 [--backend] [--frontend] [--both]"
  exit 1
}

start_backend() {
  if [ ! -f "$BACKEND_DIR/main.py" ]; then
    echo "No backend/main.py found in $BACKEND_DIR"
    return 1
  fi
  command -v python3 >/dev/null 2>&1 || { echo "python3 not found"; return 1; }
  if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtualenv in $VENV_DIR"
    python3 -m venv "$VENV_DIR"
  fi
  echo "Installing backend requirements..."
  "$VENV_DIR/bin/pip" install --upgrade pip >/dev/null
  if [ -f "$BACKEND_DIR/requirements.txt" ]; then
    "$VENV_DIR/bin/pip" install -r "$BACKEND_DIR/requirements.txt"
  fi
  echo "Starting backend (logs -> $ROOT/backend.log)"
  nohup "$VENV_DIR/bin/python" "$BACKEND_DIR/main.py" > "$ROOT/backend.log" 2>&1 &
  echo $! >> "$PIDFILE"
}

start_frontend() {
  if [ ! -f "$FRONTEND_DIR/package.json" ]; then
    echo "No frontend/package.json found in $FRONTEND_DIR"
    return 1
  fi
  command -v npm >/dev/null 2>&1 || { echo "npm not found"; return 1; }
  pushd "$FRONTEND_DIR" >/dev/null
  if [ ! -d node_modules ]; then
    echo "Installing frontend dependencies..."
    npm install
  fi
  echo "Starting frontend (logs -> $ROOT/frontend.log)"
  nohup npm run dev > "$ROOT/frontend.log" 2>&1 &
  echo $! >> "$PIDFILE"
  popd >/dev/null
}

cleanup() {
  echo "Stopping started processes..."
  if [ -f "$PIDFILE" ]; then
    while read -r pid; do
      if [ -n "$pid" ]; then
        kill "$pid" >/dev/null 2>&1 || true
      fi
    done < "$PIDFILE"
    rm -f "$PIDFILE"
  fi
  exit 0
}

trap cleanup INT TERM

if [ "$#" -eq 0 ]; then
  MODE="both"
else
  MODE=""
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --backend) MODE="backend"; shift ;;
      --frontend) MODE="frontend"; shift ;;
      --both) MODE="both"; shift ;;
      -h|--help) usage ;;
      *) echo "Unknown arg: $1"; usage ;;
    esac
  done
fi

rm -f "$PIDFILE"

case "$MODE" in
  backend)
    start_backend || exit 1
    ;;
  frontend)
    start_frontend || exit 1
    ;;
  both)
    start_backend || true
    start_frontend || true
    ;;
  *)
    usage
    ;;
esac

if [ -f "$PIDFILE" ]; then
  echo "Started services. PIDs:"
  cat "$PIDFILE"
  echo "Tail logs with: tail -f $ROOT/backend.log $ROOT/frontend.log"
  # Wait for background processes
  while read -r pid; do
    if [ -n "$pid" ]; then
      wait "$pid" || true
    fi
  done < "$PIDFILE"
fi

cleanup
