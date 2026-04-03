pipeline {
    agent any

    environment {
        DOCKERHUB_CRED = credentials('dockerhub-cred')     // ← create this credential in Jenkins
        IMAGE_BE       = 'heyiamkanishka/expense-tracker-backend'
        IMAGE_FE       = 'heyiamkanishka/expense-tracker-frontend'
        TAG            = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
                echo '✅ Code checked out from GitHub'
            }
        }

        stage('Install Dependencies & Run Tests') {
            steps {
                echo '🔧 Installing backend dependencies...'
                dir('backend') {
                    sh 'npm ci'
                    sh 'npm test --if-present'
                }
                echo '🔧 Installing frontend dependencies...'
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm test --if-present'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🏗️ Building Docker images with nginx proxy...'
                sh 'docker-compose build --no-cache'
            }
        }

        stage('Login & Push to Docker Hub') {
            steps {
                echo '🔐 Logging into Docker Hub...'
                sh "echo ${DOCKERHUB_CRED_PSW} | docker login -u ${DOCKERHUB_CRED_USR} --password-stdin"

                // Push backend
                sh "docker tag expense-tracker-backend:latest ${IMAGE_BE}:${TAG}"
                sh "docker tag expense-tracker-backend:latest ${IMAGE_BE}:latest"
                sh "docker push ${IMAGE_BE}:${TAG}"
                sh "docker push ${IMAGE_BE}:latest"

                // Push frontend
                sh "docker tag expense-tracker-frontend:latest ${IMAGE_FE}:${TAG}"
                sh "docker tag expense-tracker-frontend:latest ${IMAGE_FE}:latest"
                sh "docker push ${IMAGE_FE}:${TAG}"
                sh "docker push ${IMAGE_FE}:latest"

                echo '🚀 Images successfully pushed to Docker Hub'
            }
        }

        stage('Deploy to Staging Server') {
            steps {
                echo '🚀 Deploying to EC2 staging...'
                sh '''
                    docker-compose down
                    docker-compose pull
                    docker-compose up -d --force-recreate
                '''
                echo '✅ Deployment completed successfully!'
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline finished successfully! App is live on http://16.16.212.80:3000'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}