#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

ENV_FILE="$REPO_ROOT/.env"
if [ -f "$ENV_FILE" ]; then
  echo "Loading $ENV_FILE"
  set -a
  source "$ENV_FILE"
  set +a
else
  echo "ERROR: No .env file found at $ENV_FILE"
  exit 1
fi

echo "Running backend tests..."

php "$SCRIPT_DIR/tests/student_login_test.php"
php "$SCRIPT_DIR/tests/reading_log_test.php"

echo "Backend tests completed."
