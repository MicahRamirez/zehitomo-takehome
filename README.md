## Running the project

0. Clone the repo and `npm install`
1. `cp .env.local.example .env.local`
2. Obtain the `MONGODB_URI` and `MONGODB_DB`variables from the submission email
3. Copy the URI and DB to the respective variables in `.env.local`
4. Obtain an unplash access key, copy the access key into `UNSPLASH_ACCESS_KEY` in `.env.local`
5. In `.env.local` ensure `UNSPLASH_IS_MOCK=false`
6. To start the app locally `npm run dev`

## Rationale for technology choices

- Chose NextJS because of the ease of deployment, configuration, and its opinionated nature. The encouraged patterns extend very well into a production application.
- Chose MongoDB as its something Zehitomo uses and wanted to challenge myself to get familiar with it in the minimum amount of time possible.
- Used material-ui design library as its fairly easy to customize and had components to fit the requirements of the UI.
- Used formik & yup to quickly create forms with basic form requirements

## Specific design decisions

- Scrollable grid, has an instagram/unsplash-like feel
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
4. Documentation
5. Testing
6. Get all pages for a search keyword or implement infinite scroll to lazily page through results
7. A better notion of saving lists to a user beyond utilizing local storage

### What to fix

1. Not getting full search results from unsplash
2. Better separation of concerns between api responses, error handling, and interacting with the data models. I've worked on projects which had controllers which were responsible for validating input to api, handling what status codes, and responses to send back. Then there were models which for a specific entity (e.g. List or Photos) had methods for interacting with the model in the DB (getList, getLists, etc). I didn't really separate these very well in my BE.
3. Better typing between FE/BE
4. Error handling on the FE and BE or failed api requests, runtime errors, etc.
5. Either commit to using axios or dont use it at all
6. Include the downloadUrl when saving photos on the List data model.
7. Invoke the downloadUrl when saving photos
8. Since you can scroll within the photo lists on the lists page you can kinda get stuck in some cases. Just the design in general on the lists page needs a bit more thought.
9. Bigger icons for download and favorite
10. The `<rect>` element I used to put a border around the download and save icons doesn't render properly on the server and yields console errors.
