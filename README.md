## Running the project

1. Install mongoDB locally
2. Create a db for the project
3. copy .env.local.example to .env.local `cp .env.local.example .env.local`
4. update env vars in .env.local to reflect the db, user and password

## Rationale for technology choices

- Chose NextJS because the ease of deployment, configuration, and its opinionated nature. The encouraged patterns extend very well into a production application.
- Chose MongoDB as its something Zehitomo uses and wanted to challenge myself to get familiar with it in the minimum amount of time possible.
- Used material-ui design library as its fairly easy to customize and had components to fit the requirements of the UI.

## Specific design decisions

## Specific implementation decisions

### What to improve

1. A docker compose recipe to pull up the project quickly so that devs don't have to rely on local settings/configuration

### What to fix
