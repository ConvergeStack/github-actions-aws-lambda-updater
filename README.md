# Github Action to update AWS Lambda

```yaml
name: 🛸 Update Lambda

on:
  # Your trigger step

jobs:
  deploy:
    name: 🚀 Deploy ... to ...
    runs-on: ubuntu-latest # maybe self-hosted
    timeout-minutes: 10

    steps:
      - name: 📍 Checkout Code
        uses: actions/checkout@v3

      - name: 🏗 Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 16.x

      # Optional step based upon language used by your lambda
      - name: 📦 Install lambda dependencies
        run: npm ci

      # Modify this as per files you would like to zip and trigger lambda deploy
      - name: 📁 Zip lambda code
        run: zip -r ./lambda-source.zip *

      # 
      - name: 🚀 Update myAwesomeLambda
        uses: ConvergeStack/github-actions-aws-lambda-updater@master
        with:
          awsAccessKey: ${{ secrets.AWS_ACCESS_KEY_ID }}
          awsSecretKey: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          lambdaRegion: "us-east-1" # Lambda region
          lambdaName: "myAwesomeLambda" # Lambda name in aws
          zipFilePath: "./lambda-source.zip"

```