# Project Instructions

## Overview
This is an Angular 17 + Node.js CRUD application with MongoDB database.

## Project Structure
- `/angular-17-client` - Angular 17 frontend application
- `/node-express-mongodb-server` - Node.js Express backend server

## Running the Project

### Prerequisites
- Node.js 18+
- MongoDB (running on port 27017)

### Backend (Node.js + Express)
```bash
cd node-express-mongodb-server
node server.js
```
Server runs on http://localhost:8080

### Frontend (Angular 17)
```bash
cd angular-17-client
ng serve --port 8081
```
App runs on http://localhost:8081

### MongoDB via Docker
```bash
docker run -d --name mongodb -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo
```

## Database Configuration
MongoDB connection is configured in `node-express-mongodb-server/app/config/db.config.js`

## API Endpoints
- `GET /api/tutorials` - Get all tutorials
- `GET /api/tutorials/:id` - Get tutorial by ID
- `POST /api/tutorials` - Create new tutorial
- `PUT /api/tutorials/:id` - Update tutorial
- `DELETE /api/tutorials/:id` - Delete tutorial
- `GET /api/tutorials?title=` - Search tutorials by title