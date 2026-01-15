#!/bin/bash
cd "$(dirname "$0")"
npm install
echo "package-lock.json generated. Now run: docker-compose up -d --build frontend"
