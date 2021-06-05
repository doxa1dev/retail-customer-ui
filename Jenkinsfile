pipeline {
  agent any
  
  options { 
    disableConcurrentBuilds() 
  }

  tools {
      // docker "jenkins-docker"
      nodejs "node10"
  }

  environment {
    HOME = '.'
    DOMAIN_NAME = 'doxa-holdings.com'
    DATETIME_TAG = (java.time.LocalDateTime.now()).format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
    SLACK_CHANNEL = '#jenkins-retail'
    EC2_DEPLOYMENT_FOLDER = 'retail-customer-ui'

  }

  stages {
    stage('Set variables') {
      parallel {
        stage('Set variables for STAGE') {
          steps {
            script {
              branchDelimitted = env.BRANCH_NAME.split('/')
              stageName = branchDelimitted[1].trim()

              switch (stageName) {
                case 'stag2-thermomix-sg':
                  DISTRIBUTION_PATH = "dist/doxa-retail"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-DEV-STAG2'
                  NG_CONFIG = 'stag2-thermomix-sg'
                  break
                case 'stag2a-thermomix-my':
                  DISTRIBUTION_PATH = "dist/doxa-retail"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-DEV-STAG2A'
                  EC2_DEPLOYMENT_FOLDER = 'customer-thermomix-my'  
                  NG_CONFIG = 'stag2a-thermomix-my'
                  break
                case 'stag2a-thermomix-sg':
                  DISTRIBUTION_PATH = "dist/doxa-retail"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-DEV-STAG2A'
                  // EC2_DEPLOYMENT_FOLDER = 'retail-customer-ui'
                  NG_CONFIG = 'stag2a-thermomix-sg'
                  break
                case 'stag2a-thermomix-vn':
                  DISTRIBUTION_PATH = "dist/doxa-retail"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-DEV-STAG2A'
                  EC2_DEPLOYMENT_FOLDER = 'customer-thermomix-vn'
                  NG_CONFIG = 'stag2a-thermomix-vn'
                  break
                case 'stag2b-thermomix-sg':
                  DISTRIBUTION_PATH = "dist/doxa-retail"
                  NG_CONFIG = 'stag2a-thermomix-sg'
                  break

                case 'uat-thermomix-sg':
                  DISTRIBUTION_PATH = "dist/doxa-retail"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-DEV-UAT'
                  NG_CONFIG = 'uat-thermomix-sg'
                  break

                case 'uat-thermomix-my':
                  DISTRIBUTION_PATH = "dist/doxa-retail"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-DEV-UAT'
                  EC2_DEPLOYMENT_FOLDER = 'customer-thermomix-my'
                  NG_CONFIG = 'uat-thermomix-my'
                  break

                case 'uat-thermomix-vn':
                  DISTRIBUTION_PATH = "dist/doxa-retail"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-DEV-UAT'
                  EC2_DEPLOYMENT_FOLDER = 'customer-thermomix-uat-vn'
                  NG_CONFIG = 'uat-thermomix-vn'
                  break

                case 'stag5-thermomix-sg':
                  DISTRIBUTION_PATH = "dist/doxa-retail"
                  // S3_BUCKET = "stag5-thermomix-sg.${env.DOMAIN_NAME}"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-DEV-STAG5'
                  NG_CONFIG = 'stag5-thermomix-sg'
                  break

                case 'prod-thermomix-sg':
                  DISTRIBUTION_PATH = "dist/doxa-retail"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-PROD'
                  NG_CONFIG = 'prod-thermomix-sg'
                  break

                case 'prod-thermomix-my':
                  DISTRIBUTION_PATH = "dist/doxa-retail"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-PROD'
                  EC2_DEPLOYMENT_FOLDER = 'customer-thermomix-my'
                  NG_CONFIG = 'prod-thermomix-my'
                  break

                case 'prod-thermomix-vn':
                  DISTRIBUTION_PATH = "dist/doxa-retail"
                  EC2_PUBLISH_OVER_SSH_SERVER_NAME='EC2-RETAIL-PROD'
                  EC2_DEPLOYMENT_FOLDER = 'customer-thermomix-prod-vn'
                  NG_CONFIG = 'prod-thermomix-vn'
                  break
              }
            }
          }
        }

        stage('Set notification info') {
          steps {
              script {
                NOTIFICATION_INFORMATION = "---------\n BUILD_TAG ${env.BUILD_TAG} \n GIT_URL ${env.GIT_URL} \n GIT_BRANCH ${env.GIT_BRANCH} \n GIT_COMMIT ${env.GIT_COMMIT} \n DATETIME_TAG ${DATETIME_TAG} \n ---------"
              }
          }
        }
      }
    }

    stage('Send START Notification') {
      steps {
        slackSend(color: '#FFFF00', channel: "${SLACK_CHANNEL}", message: "\n *** START TO DEPLOY on *** \n ${NOTIFICATION_INFORMATION}")
      }
    }

    // stage('Create a git tag') {
    //         steps {
    //           withCredentials([usernameColonPassword(credentialsId: 'github-nathalie', variable: 'GIT_TAG_CREDENTIALS'), string(credentialsId:'github-repo-frontend-deployment', variable: 'GIT_REPO_BACKUP_URL')]) {
    //             script {
    //               gitDateTime = (java.time.LocalDateTime.now()).format(java.time.format.DateTimeFormatter.ofPattern("yyMMdd_HHmmss"))
    //               gitTagName = "build_${NG_CONFIG}_${gitDateTime}"
    //               try {
    //                   sh "git tag -a ${gitTagName} -m \"${DATETIME_TAG}\""

    //               } catch(e) {
    //                   sh "echo ${e}"
    //               }
    //               echo "${gitTagName}"
    //               sh "git push https://${GIT_TAG_CREDENTIALS}@${GIT_REPO_BACKUP_URL} ${gitTagName}"
    //             }
    //           }
    //         }
    //     }

    stage('Print variables'){
      steps {
        echo "Jenkins Information ---- EXECUTOR_NUMBER ${env.EXECUTOR_NUMBER}"
        echo "Git Information ---- GIT_COMMIT ${env.GIT_COMMIT} --- GIT_URL ${env.GIT_URL} --- GIT_BRANCH ${env.GIT_BRANCH}"
        echo "Build Information ---- DISTRIBUTION_PATH ${DISTRIBUTION_PATH} --- NG_CONFIG ${NG_CONFIG}"
        echo "Workspace ---- WORKSPACE ${WORKSPACE}"
      }
    }

    stage('Install Packages') {
      steps {
        sh 'npm version'
        sh 'npm install @angular/cli'
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
        // sh "node_modules/.bin/ng build -c ${NG_CONFIG}"
        sh "node --max_old_space_size=4096 node_modules/.bin/ng build -c ${NG_CONFIG}"
      }
    }
    stage('Deploy to EC2') {
      steps{
        slackSend(channel: "${SLACK_CHANNEL}", message: "Copying built code to EC2", sendAsText: true)
        
        sshPublisher(publishers: [sshPublisherDesc(configName: "${EC2_PUBLISH_OVER_SSH_SERVER_NAME}", transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: "rm -rf ${EC2_DEPLOYMENT_FOLDER}; exit", execTimeout: 30000)], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true, usePty: true)])

        sshPublisher(publishers: [sshPublisherDesc(configName: "${EC2_PUBLISH_OVER_SSH_SERVER_NAME}", transfers: [sshTransfer(cleanRemote: false, excludes: '', execCommand: '', execTimeout: 30000, flatten: false, makeEmptyDirs: false, noDefaultExcludes: false, patternSeparator: '[, ]+', remoteDirectory: "./${EC2_DEPLOYMENT_FOLDER}", remoteDirectorySDF: false, removePrefix: '', sourceFiles: "**/*")], usePromotionTimestamp: false, useWorkspaceInPromotion: false, verbose: true, usePty: true)])

      }
    }

  }

  post {
    always {
      /* Clean Jenkins Workspace */
      dir('..') {
        sh "rm -rf ${env.WORKSPACE}/*"
      }

      /* Use slackNotifier.groovy from shared library and provide current build result as parameter */

      script {
        COLOR_MAP = ['SUCCESS': 'good', 'FAILURE': 'danger', 'UNSTABLE': 'danger', 'ABORTED': 'danger']
        BUILD_FAILURE_CAUSE='=='
        if (currentBuild.currentResult=='FAILURE') {
            BUILD_FAILURE_CAUSE = currentBuild.getBuildCauses()
        }
        slackSend(color: COLOR_MAP[currentBuild.currentResult], channel: "${SLACK_CHANNEL}", message: "END DEPLOYMENT with status ${currentBuild.currentResult} \n ${BUILD_FAILURE_CAUSE} \n ${NOTIFICATION_INFORMATION}")
      }
    }
  }
}
