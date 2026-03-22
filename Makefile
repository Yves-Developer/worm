.PHONY: install dev gateway control-plane cli test run-all stop

stop:
	@-lsof -ti:3000 -ti:3001 -ti:3002 2>/dev/null | xargs kill -9 2>/dev/null; echo "Stopped services on 3000, 3001, 3002"

run-all: stop
	@echo "Starting control plane (3001), gateway (3002), website (3000), CLI..."
	@cd packages/gateway && go build -o gateway . 2>/dev/null || true
	@cd packages/cli && npm run build 2>/dev/null || true
	@(cd packages/control-plane && npm run dev) &
	@(sleep 2 && cd packages/gateway && WORMKEY_CONTROL_PLANE=http://localhost:3001 ./gateway) &
	@(sleep 3 && cd website && PORT=3000 npm run dev) &
	@(sleep 8 && cd packages/cli && WORMKEY_CONTROL_PLANE_URL=http://localhost:3001 WORMKEY_EDGE_URL=ws://localhost:3002/tunnel node dist/cli.js http 3000) &
	@echo "All started. Website: http://localhost:3000 | Control plane: http://localhost:3001 | Gateway: http://localhost:3002"
	@echo "Tunnel URL will appear shortly. Run 'make stop' to kill all."

install:
	cd packages/cli && npm install
	cd packages/control-plane && npm install
	cd packages/gateway && go mod download

build:
	cd packages/cli && npm run build
	cd packages/control-plane && npm run build

gateway:
	cd packages/gateway && go run .

control-plane:
	cd packages/control-plane && npm run dev

cli:
	cd packages/cli && npm run dev -- http 3000
