/**
 * Set this to true when testing on local.
 * This sets the github action variables.
 */
const SIMULATING_ON_LOCAL = false

const CORE = require('@actions/core')
const FS = require('fs')
const PATH = require('path')
const LAMBDA_SDK = require('@aws-sdk/client-lambda')

/**
 * Returns the variable set on Github
 * @param {string} inputKey
 * @returns {string}
 */
const getGithubActionInputValue = function (inputKey) {
  if (SIMULATING_ON_LOCAL) {
    return getGithubActionInputValueSimulating(inputKey)
  }
  const value = CORE.getInput(inputKey)
  if (value === '') {
    throw new Error(
      `Invalid ${inputKey}: did you forget to set it in your action config?`
    )
  }
  return value
}

/**
 * Only to use for getGithubActionInputValue() for local env use
 * @param {string} inputKey
 * @returns {string}
 */
const getGithubActionInputValueSimulating = function (inputKey) {
  switch (inputKey) {
    case 'lambdaName':
      return 'testLambda'
    case 'zipFilePath':
      return PATH.join(__dirname, 'testLambda-sample-code.zip')
    case 'lambdaRegion':
      return 'us-east-1'
    default:
      throw new Error(
        `Invalid ${inputKey}: did you forget to set it in getGithubActionInputValueSimulating()`
      )
  }
}

const getFileContents = function (filePath) {
  return FS.readFileSync(filePath)
}

/**
 * Initialize Lambda Client
 */
const LAMBDA_CLIENT = new LAMBDA_SDK.LambdaClient(
  SIMULATING_ON_LOCAL
    ? {
        region: getGithubActionInputValue('lambdaRegion')
      }
    : {
        region: getGithubActionInputValue('lambdaRegion'),
        credentials: {
          accessKeyId: getGithubActionInputValue('awsAccessKey'),
          secretAccessKey: getGithubActionInputValue('awsSecretKey')
        }
      }
)

/**
 * Entry point of this file
 */
async function run () {
  await LAMBDA_CLIENT.send(
    new LAMBDA_SDK.UpdateFunctionCodeCommand({
      FunctionName: getGithubActionInputValue('lambdaName'),
      Publish: true,
      // DryRun: true,
      ZipFile: new Uint8Array(
        getFileContents(getGithubActionInputValue('zipFilePath'))
      )
    })
  )
}

/**
 * Calls the entry function of this file.
 */
run().catch((e) => {
  CORE.setFailed(e.message)
  throw e
})
