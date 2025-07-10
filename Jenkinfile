pipeline {
    agent { label 'jenkins-agent1' }

    tools {
        nodejs 'nodejs20'
    }

    environment {
        SONAR_PROJECT_KEY = 'frontend-profile'
        SONAR_HOST_URL = 'http://10.14.1.49:9000'
        SONAR_TOKEN = 'sqp_05341675b56c3f5b904c2563b78b1886413dde93'
        SONARQUBE_SCANNER_HOME = tool 'sonar-scanner'
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'master', url: 'https://github.com/poojabharambe18/EnfinityUI.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm packages...'
                sh 'npm install'
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building React project...'
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Running SonarQube Scan...'
                withSonarQubeEnv('sonarqube-token') {
                    sh """
                        ${SONARQUBE_SCANNER_HOME}/bin/sonar-scanner \
                          -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                          -Dsonar.sources=. \
                          -Dsonar.host.url=${SONAR_HOST_URL} \
                          -Dsonar.login=${SONAR_TOKEN} \
                          -Dsonar.sourceEncoding=UTF-8
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}

