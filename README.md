# Expense Tracker - MERN Stack + Docker + Jenkins CI/CD

A complete Expense Manager built with MERN stack, fully containerized with Docker, and automated with Jenkins CI/CD.

**Live URL:** [http://16.16.212.80:3000](http://16.16.212.80:3000)

---

## Project Overview

This project demonstrates a production-ready MERN application with:
- Docker + Docker Compose for containerization
- Nginx reverse proxy for production frontend
- Persistent MongoDB with volumes
- Full CI/CD pipeline using Jenkins

---

## Tech Stack

- **Frontend**: React + Vite + Axios + Lucide Icons
- **Backend**: Node.js + Express + Mongoose
- **Database**: MongoDB
- **Containerization**: Docker + Docker Compose
- **CI/CD**: Jenkins
- **Reverse Proxy**: Nginx

---

## How to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/heyiamkanishka/expense-tracker.git
cd expense-tracker

# 2. Start the full stack
docker-compose up --build -d

# 3. Open browser
http://localhost:3000












To stop:
docker-compose down


Manual Deployment on EC2 (Staging)
Steps we performed on EC2:

Launched Ubuntu EC2 instance
Installed Docker + Docker Compose
Added user to docker group and fixed permissions
Cloned the repository
Fixed container name conflicts and MongoDB connection
Deployed using Docker Compose

Key Commands used on EC2:


git clone https://github.com/heyiamkanishka/expense-tracker.git
cd expense-tracker

sudo docker-compose up --build -d

# Force clean rebuild
sudo docker-compose down
sudo docker rmi expense-tracker_frontend:latest -f
sudo docker-compose up --build -d

# Check status
sudo docker-compose ps
sudo docker-compose logs backend --tail=30



CI/CD Pipeline with Jenkins
Fully automated: Every git push to main branch triggers the pipeline.
Pipeline Stages:

Checkout Code
Install Dependencies & Run Tests
Build Docker Images
Push Images to Docker Hub
Deploy to Staging Server (EC2)

Jenkinsfile Features:

Automatic cleanup of old containers
Proper Docker image tagging
Strong error handling
Success/failure notifications in console


Complete Summary of Our Journey
Phase 1: Local Docker Setup

Created docker-compose.yml, backend/Dockerfile, frontend/Dockerfile
Fixed port 5001, MongoDB connection, and volumes
Tested locally until CRUD worked perfectly

Phase 2: Production Fixes

Switched to relative API paths (/api/expenses)
Added Nginx reverse proxy (frontend/nginx.conf)
Updated Dockerfile to include Nginx config

Phase 3: Manual EC2 Deployment

Set up EC2, Docker, permissions
Cloned repo and ran manual deployment
Fixed repeated permission and container name issues
Verified live app at http://16.16.212.80:3000

Phase 4: Jenkins Automation

Installed Jenkins + Java + Node.js on EC2
Added jenkins user to Docker group
Created Docker Hub credential
Built and refined the Jenkinsfile
Successfully ran full automated pipeline


Final Workflow (Current State)

You make changes locally → git push origin main
GitHub webhook triggers Jenkins automatically
Jenkins builds, tests, pushes images to Docker Hub
Jenkins deploys latest version to EC2
Live app updates in ~1 minute 36 seconds