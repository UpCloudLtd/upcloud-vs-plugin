install_vsce: 
    npm install -g vsce

build:
    vsce package
    mv *.vsix ./vsix/

publish:
    vsce publish

npm_outdated:
    npm outdated
    npx npm-check-updates

npm_upgrade:
    brew upgrade # upgrade homebrew
    brew install node # install the latest node version
    npm install -g npm@latest # upgrade to the latest version
    nvm alias default node # set the default node version
    nvm install node # install the latest node version

    npm upgrade # upgrade all packages used in the project

npm_doctor:
    node -v
    npm -v
    tsc -v
    npm doctor
    npm prune # remove unused dependencies
    npx depcheck # check dependencies
    npm-check # check dependencies
    
npm-install:
    rm -rf node_modules package-lock.json
    npm install
    npx tsc --noEmit

npm_rebuild:
    rm -rf node_modules
    npm install

localstack_start:
    localstack start

localstack_stop:
    localstack stop

localstack_status:
    localstack status

localstack_logs:
    localstack logs

localstack_help:
    localstack --help 

localstack_update:
    localstack update

create_bucket:
    aws --endpoint-url=http://localhost:4566 s3 mb s3://my-bucket

list_buckets:
    aws --endpoint-url=http://localhost:4566 s3 ls

upload_file:
    aws --endpoint-url=http://localhost:4566 s3 cp README.md s3://my-bucket