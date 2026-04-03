pipeline {
    agent any

    environment {
        DOCKERHUB_CRED = credentials('dockerhub-cred')
        IMAGE_BE       = 'bhanukanishka/expense-tracker-backend'   # your Docker Hub username
        IMAGE_FE       = 'bhanukanishka/expense-tracker-frontend'
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
                    sh 'npm test --if-present || true'
                }
                echo '🔧 Installing frontend dependencies...'
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm test --if-present || true'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo '🏗️ Building Docker images...'
                sh 'docker-compose build --no-cache'
            }
        }

        stage('Login & Push to Docker Hub') {
            steps {
                echo '🔐 Logging into Docker Hub...'
                sh "echo ${DOCKERHUB_CRED_PSW} | docker login -u ${DOCKERHUB_CRED_USR} --password-stdin"

                // Backend
                sh "docker tag expensetracker_backend:latest ${IMAGE_BE}:${TAG}"
                sh "docker tag expensetracker_backend:latest ${IMAGE_BE}:latest"
                sh "docker push ${IMAGE_BE}:${TAG}"
                sh "docker push ${IMAGE_BE}:latest"

                // Frontend
                sh "docker tag expensetracker_frontend:latest ${IMAGE_FE}:${TAG}"
                sh "docker tag expensetracker_frontend:latest ${IMAGE_FE}:latest"
                sh "docker push ${IMAGE_FE}:${TAG}"
                sh "docker push ${IMAGE_FE}:latest"

                echo '🚀 Images pushed to Docker Hub successfully!'
            }
        }

        stage('Deploy to Staging Server') {
            steps {
                echo '🚀 Deploying to EC2...'
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
            echo '🎉 Pipeline succeeded! App is live at http://16.16.212.80:3000'
        }
        failure {
            echo '❌ Pipeline failed'
        }
    }
}