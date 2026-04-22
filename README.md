# Wanderlust (Airbnb Clone)

Wanderlust is a full-stack listing and reviews web application inspired by Airbnb.
It allows users to sign up, log in, create property listings, upload images, add reviews, and browse locations on a map.

## Tech Stack

- Node.js (engine: 20.16.0)
- Express.js
- MongoDB + Mongoose
- EJS + ejs-mate (templating/layouts)
- Passport.js (local authentication)
- express-session + connect-mongo (session store)
- Cloudinary + Multer (image upload/storage)
- Mapbox (geocoding + map rendering)
- Joi (request validation)
- Bootstrap 5 + custom CSS

## Project Structure

- `app.js`: app entry point, middleware setup, DB connection, route mounting, error handlers
- `cloudConfig.js`: Cloudinary setup, Multer Cloudinary storage, Cloudinary auth check middleware
- `middleware.js`: auth guards, ownership checks, Joi validation middleware
- `schema.js`: Joi schemas for listing and review payloads
- `controllers/`: route handler logic for listings, reviews, users
- `routes/`: Express routers grouped by domain
- `models/`: Mongoose models (`Listing`, `Review`, `User`)
- `views/`: EJS templates (layout, partials, listing/user pages)
- `public/`: static frontend assets (CSS and client-side JS)
- `init/`: seed scripts and sample listing data
- `utils/`: utility helpers (`ExpressError`, `wrapAsync`)

## Features

- User authentication (signup, login, logout)
- Session-backed login state with flash messages
- Create, edit, delete listings (owner-only edits/deletes)
- Upload listing images to Cloudinary
- Geocode listing location via Mapbox and store coordinates
- View listing location on Mapbox map
- Post and delete reviews (review author-only delete)
- Search listings by city/location
- Frontend form validation and tax toggle UI

## Data Models

### Listing

- `title` (required)
- `description`
- `image`: `{ filename, url }` with default image fallback
- `price`
- `location`
- `country`
- `geocode`: GeoJSON Point (`type`, `coordinates`)
- `reviews`: array of `Review` ObjectIds
- `owner`: `User` ObjectId

### Review

- `comment`
- `rating` (1-5)
- `createdAt`
- `author`: `User` ObjectId

### User

- `email` (required)
- authentication fields from `passport-local-mongoose` (e.g. username, password hash/salt)

## Environment Variables

Create a `.env` file in the project root with:

```env
CONNECTION_STRING=mongodb://127.0.0.1:27017/wanderlust
SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

MAPBOX_SECRET=your_mapbox_access_token
```

Notes:

- `CONNECTION_STRING` is used by the app for MongoDB and by `connect-mongo` for session storage.
- In seed scripts under `init/`, MongoDB URL is currently hardcoded to `mongodb://127.0.0.1:27017/wanderlust`.

## Installation

```bash
npm install
```

## Running the App

There is no `start` script in `package.json`, so run directly:

```bash
node app.js
```

The server listens on:

- `http://localhost:8080`

## Seed Data

Two seed scripts are present:

1. Basic seed (inserts sample listings):

```bash
node init/index.js
```

2. Seed with fixed owner ID in each listing:

```bash
node init/inserDataWithOwner.js
```

Important:

- `inserDataWithOwner.js` uses a hardcoded owner ObjectId. Ensure that user exists if you rely on owner-linked operations.

## Routes Overview

### Root

- `GET /` -> home page (`views/listings/home.ejs`)

### User Routes

- `GET /signup` -> signup form
- `POST /signup` -> create user and auto-login
- `GET /login` -> login form
- `POST /login` -> authenticate user
- `GET /logout` -> logout user

### Listing Routes

- `GET /listings` -> all listings
- `GET /listings/new` -> create form (auth required)
- `POST /listings` -> create listing (auth + Cloudinary check + upload + validation)
- `GET /listings/search?query=...` -> search by location
- `GET /listings/:id` -> listing details
- `GET /listings/:id/edit` -> edit form (auth + owner)
- `PUT /listings/:id` -> update listing (auth + owner + optional image upload)
- `DELETE /listings/:id` -> delete listing (auth + owner)

### Review Routes

Mounted under `/listings/:id/reviews`:

- `POST /listings/:id/reviews` -> create review (auth + validation)
- `DELETE /listings/:id/reviews/:reviewId` -> delete review (auth + review owner)

## Frontend Notes

- `public/js/script.js`: Bootstrap form validation helper
- `public/js/taxes.js`: toggles before-tax/after-tax pricing display (+13%)
- `public/js/map.js`: renders listing map using Mapbox with popup marker
- `public/css/starability-slot.css`: star rating UI styles

## Error Handling

- 404 handler for unmatched routes
- Centralized error middleware rendering `views/error.ejs`
- Async route safety via `utils/wrapAsync.js`

## Authentication and Authorization

- Passport local strategy with `passport-local-mongoose`
- `isLoggedIn` middleware redirects unauthenticated users to `/login`
- `isOwner` protects listing modifications
- `isReviewOwner` protects review deletion

## Notes and Known Considerations

- `app.js` serves static files from `public/css` and `public/js` separately.
- `cookie-parser` is installed but not used in `app.js`.
- `.gitignore` excludes `.env`, `node_modules`, and upload directories.
- Search currently matches exact `location` value.

## License

Project `package.json` currently uses `ISC` license.
