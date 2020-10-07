## Running the project

1. Install mongoDB locally
2. Create a db for the project
3. copy .env.local.example to .env.local `cp .env.local.example .env.local`
4. update env vars in .env.local to reflect the db, user and password

## Rationale for technology choices

- Chose NextJS because the ease of deployment, configuration, and its opinionated nature. The encouraged patterns extend very well into a production application.
- Chose MongoDB as its something Zehitomo uses and wanted to challenge myself to get familiar with it in the minimum amount of time possible.
- Used material-ui design library as its fairly easy to customize and had components to fit the requirements of the UI.
- Used formik & yup to quickly create forms with basic form requirements

## Specific design decisions

- Scrollable grid, has an instagram/unsplash like feel
- Search bar fixed to top so user can edit search or at a glance see what search term the results are associated with
- Implemented the onHover states based on pdf requirements
- onHover states on image buttons to communicate their interactivity
- profileLinks open in a new tab because who wants their existing search work clobbered by opening the profile in the same tab
- used a modal for saving the photo to a list/creating a list, forces user to focus on the original intent of their action

## Specific implementation decisions

- Scrollable grid for the photos
- Debounced search and useSwr which provides some caching out of the box (Minimizing usage of API given tiny usage limit)
- API Endpoints can be ran in lambdas, easier scaling
- Used local storage to map a lists to a specific 'user'

### What to improve

1. A docker compose recipe to pull up the project quickly so that devs don't have to rely on local settings/configuration
2. Input validation for the image search. What constitutes a valid input for the search though? I thought searching for full english words would be a good start. There was at least one npm package that had a few language supported out of the box, but that validation would need to happen on the BE since the lib was 35MB+.
3. Increasing the limit on the API. 50 requests PER HOUR is NOTHING. In order to do increase the limit, I'd need to utilize the download endpoint for the photos as the user interacts with the photos in various ways https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
4.

### What to fix

1. Get all pages for a search keyword or implement infinite scroll to lazily page through results
2. A better notion of saving lists to a user beyond utilizing local storage
3. Better separation of concerns between api responses, error handling, and interacting with the data models. I've worked on projects which had controllers which were responsible for validating input to api, handling what status codes, and responses to send back. Then there were models which for a specific entity (e.g. List or Photos) had methods for interacting with the model in the DB (getList, getLists, etc). I didn't really separate these very well in my BE.
4. Better typing between FE/BE
5. Error handling on the FE for failed api requests, runtime errors, etc.
6. Get rid of axios... It was munging the image buffer from the BE. For awhile I couldn't download the images properly solely because this library.
7. Include the downloadUrl when saving photos on the List data model.
8. Invoke the downloadUrl when saving photos
