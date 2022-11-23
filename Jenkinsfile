//////////////////////////////////////////////////////////////////////////////////////////

node {

    properties([
        [$class: 'BuildDiscarderProperty',
         strategy: [$class: 'LogRotator',
                    artifactDaysToKeepStr: '7',
                    artifactNumToKeepStr: '7',
                    daysToKeepStr: '7',
                    numToKeepStr: '7']],
    ])

    WORKSPACE_PATH = "${JENKINS_HOME}/workspace/${JOB_NAME}/${BUILD_NUMBER}"

    dir(WORKSPACE_PATH) {

        IS_PULL_REQUEST = true

        if (env.CHANGE_BRANCH) {
            echo "Job was started from a pull request"
        } else {
            IS_PULL_REQUEST = false
            echo "Job was started from a branch"
        }

        SCM_CHECKOUT_BRANCHES = [

        ]
        SCM_CHECKOUT_EXTENSIONS = [
            [$class: 'UserIdentity',
              name: 'Jenkins',
              email: 'sre@polymesh.network'],
        ]

        if (IS_PULL_REQUEST) {
            //SCM_CHECKOUT_BRANCHES.push([name: "*/${env.CHANGE_TARGET}"])
            SCM_CHECKOUT_BRANCHES.push([name: "*/${env.CHANGE_BRANCH}"])
            //SCM_CHECKOUT_EXTENSIONS.push([$class: 'PreBuildMerge',
            //                               options: [mergeRemote: 'origin',
            //                                         mergeTarget: env.CHANGE_TARGET]])
        } else {
            SCM_CHECKOUT_BRANCHES.push([name: "*/${env.BRANCH_NAME}"])
        }

        echo "Performing repo checkout"

        scm_variables = checkout([$class: 'GitSCM',
                                  branches: SCM_CHECKOUT_BRANCHES,
                                  extensions: SCM_CHECKOUT_EXTENSIONS,

                                  //traits: [ // to-do
                                  //  skipNotifications(),
                                  //]

                                  userRemoteConfigs: [[url: 'https://github.com/PolymeshAssociation/polymesh-apps.git',
                                                       credentialsId: 'github_username_personal_access_token']]])

        env.GIT_COMMIT = scm_variables.get('GIT_COMMIT')
        echo "GIT_COMMIT: ${env.GIT_COMMIT}"

        stage('Build') {
            sh (label: 'Run `./deploy/build.sh`',
                script: './deploy/build.sh')
        }

        //stage('Test') {
        //    sh (label: 'Run `./deploy/test.sh`',
        //        script: './deploy/test.sh')
        //}

        stage('Push') {
            sh (label: 'Run `./deploy/push.sh`',
                script: './deploy/push.sh')
        }

    }
}

//////////////////////////////////////////////////////////////////////////////////////////
