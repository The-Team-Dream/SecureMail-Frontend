#!/bin/bash

# ═══════════════════════════════════════════════════════════════
# SecureMail-Frontend — Standalone Setup Script (Mac/Linux)
# Usage: chmod +x setup.sh && ./setup.sh
# ═══════════════════════════════════════════════════════════════

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║      SecureMail-Frontend Setup           ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# ── 1. Check Docker ─────────────────────────────────────────────
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi
echo "✅ Docker is running"
echo ""

# ── 2. Create .env.standalone from example ──────────────────────
if [ ! -f .env.standalone ]; then
    cp .env.standalone.example .env.standalone
    echo "✅ Created .env.standalone"
else
    echo "ℹ️  .env.standalone already exists — skipping copy"
fi
echo ""

# ── 3. Ask for Backend URL ──────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  BACKEND URL SETUP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ⚠️  This URL is baked into the JS bundle at build time."
echo "      It must be reachable from the USER'S BROWSER,"
echo "      not from inside Docker."
echo ""
echo "  Press Enter to use default: http://localhost:3000"
echo ""
read -p "  Backend URL: " backend_url

if [ -z "$backend_url" ]; then
    backend_url="http://localhost:3000"
    echo "  ✅ Using default: http://localhost:3000"
else
    echo "  ✅ Backend URL set to: $backend_url"
fi
echo ""

# ── 4. Update docker-compose.yml with the backend URL ───────────
sed -i "s|NEXT_PUBLIC_API_URL: \".*\"|NEXT_PUBLIC_API_URL: \"${backend_url}\"|" docker-compose.yml
sed -i "s|^NEXT_PUBLIC_API_URL=.*|NEXT_PUBLIC_API_URL=${backend_url}|" .env.standalone

echo "✅ Backend URL written to docker-compose.yml and .env.standalone"
echo ""

# ── 5. Reminder ─────────────────────────────────────────────────
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ℹ️  REMINDER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  The Frontend requires the Backend to be running."
echo "  Make sure SecureMail-Backend is up on:"
echo "  $backend_url"
echo ""
echo "  If the Backend URL changes, re-run ./setup.sh"
echo "  to rebuild the image with the new URL."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "  Press Enter to start Docker..." _

# ── 6. Start Docker Compose ─────────────────────────────────────
echo ""
echo "🚀 Starting SecureMail-Frontend..."
echo "   (First build may take a few minutes)"
echo ""
docker compose down > /dev/null 2>&1
docker compose up --build -d

# ── 7. Wait for service to be healthy ───────────────────────────
echo ""
echo "⏳ Waiting for Frontend to be ready..."
RETRIES=30
until docker inspect securemail-frontend 2>/dev/null | grep -q '"healthy"'; do
    RETRIES=$((RETRIES - 1))
    if [ $RETRIES -eq 0 ]; then
        echo ""
        echo "❌ Frontend failed to start. Check logs with:"
        echo "   docker compose logs frontend"
        exit 1
    fi
    sleep 5
    echo "   still waiting..."
done

# ── 8. Done ─────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║      ✅ Frontend is running!             ║"
echo "╠══════════════════════════════════════════╣"
echo "║  Dashboard: http://localhost:3001        ║"
echo "║  Backend:   $backend_url"
echo "╠══════════════════════════════════════════╣"
echo "║  Logs:  docker compose logs -f frontend ║"
echo "║  Stop:  docker compose down             ║"
echo "╚══════════════════════════════════════════╝"
echo ""
