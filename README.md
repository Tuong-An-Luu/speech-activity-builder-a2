# Speech Activity Builder – Assessment 3

## Overview

Speech Activity Builder is a Next.js application for creating and managing
phoneme-based Wordle and Word Search learning activities.

Assessment 3 extends the application developed in Assessments 1 and 2 with
database-backed observability, operational monitoring, reporting, automated
end-to-end testing, load testing and accessibility evaluation.

The application supports persistent word lists, words, phonemes and activity
configurations while also recording usage events such as successful
generation, failed generation, activity creation and page-view duration.

## GitHub Repository

Repository: https://github.com/Tuong-An-Luu/speech-activity-builder-a3

## Technologies

- Next.js 16
- React
- TypeScript
- Prisma ORM 7
- SQLite
- Zod
- Playwright
- Apache JMeter
- Chrome Lighthouse
- Docker

## Core Application Features

- Create and manage word lists
- Create, read, update and delete words
- Store ordered phonemes
- Support multi-character phonemes
- Store word hints
- Create and manage activity configurations
- Load saved words into the Wordle builder
- Load saved word lists into the Word Search builder
- Generate standalone HTML activities
- Backend validation using Zod
- Persistent SQLite database storage
- Docker container support
- Health-check endpoint

## Assessment 3 Features

Assessment 3 adds operational monitoring and reporting to the existing
application.

The new functionality includes:

- Database-backed operational dashboard
- Reporting interface
- Successful generation tracking
- Failed generation tracking
- Activity creation tracking
- Page-view and page-duration tracking
- Average time-on-page reporting
- Most-used activity type reporting
- Wordle and Word Search usage statistics
- Operational warnings and health information
- Recent activity history
- Playwright end-to-end testing
- Apache JMeter staged load testing
- Lighthouse accessibility testing

## Database and Observability

The Prisma database contains the following main application models:

- `WordList`
- `Word`
- `Phoneme`
- `Activity`
- `UsageEvent`

Words belong to word lists and can contain multiple ordered phonemes.

Activity records store configuration information including activity type,
difficulty, hint settings, grid size, timer settings, output filename and the
associated word list.

The `UsageEvent` model provides Assessment 3 observability data. It records
information including:

- event type
- activity type
- page path
- page duration
- monitoring message
- event timestamp

Examples of recorded events include:

- `GENERATION_SUCCESS`
- `GENERATION_FAILURE`
- `ACTIVITY_CREATED`
- `PAGE_VIEW`

These records are used by the Dashboard and Reports pages.

## Operational Dashboard

The application provides an operational dashboard at:

`/dashboard`

The dashboard displays:

- system health
- number of word lists
- number of stored words
- number of Wordle activities
- number of Word Search activities
- successful generation count
- failed generation count
- average time on page
- most-used activity type
- activity usage statistics
- operational alerts
- recent recorded events

The dashboard uses database-backed data rather than fixed values.

## Reports

The reporting interface is available at:

`/reports`

The reports page provides:

- activity summary statistics
- successful and failed generation counts
- total usage-event counts
- activity creation counts
- page-view statistics
- average page duration
- recent monitoring events

## Health Check

The application exposes the following health endpoint:

`GET /health`

A healthy application returns:

`HTTP 200 OK`

The endpoint was also verified while the application was running inside the
Docker container.

## Playwright End-to-End Testing

Playwright was used to automate end-to-end testing in Chromium.

Three automated tests were implemented:

1. Health endpoint test
   - verifies that `/health` returns HTTP 200.

2. Builder CRUD workflow
   - opens the Activity management interface
   - creates a test Activity
   - edits the Activity
   - verifies the updated value
   - deletes the Activity

3. Wordle user workflow
   - opens the Wordle builder
   - configures a Wordle activity
   - generates the activity
   - verifies the standalone HTML download
   - confirms that a `GENERATION_SUCCESS` usage event is recorded

All three Playwright tests passed successfully.

Run the tests with:

```bash
npx playwright test --project=chromium

## Apache JMeter Load Testing

Apache JMeter 5.6.3 was used to evaluate the application under staged
concurrent load.

The JMeter test plan contains two workflows:

- Builder workflow
- Activity workflow

The Builder workflow sends requests to:

- `/health`
- `/manage`
- `/api/word-lists`
- `/api/words`
- `/api/activities`

The Activity workflow sends requests to:

- `/wordle`
- `/api/word-lists`
- `/word-search`
- `/api/activities`

The load test was executed at several staged concurrency levels.

| Stage | Total Threads | Samples | Average Response | Maximum Response | Error Rate |
|---|---:|---:|---:|---:|---:|
| Baseline | 2 | 9 | 50.44 ms | 106 ms | 0% |
| Low | 20 | 90 | 40 ms | 111 ms | 0% |
| Medium | 200 | 900 | 38 ms | 161 ms | 0% |
| High | 1000 | 4500 | 8435.21 ms | 26738 ms | 0% |

The application completed all four reported stages with a 0% request error
rate.

At the baseline, low and medium stages, response times remained relatively
small. At the completed high-load stage, which used 500 threads for the
Builder workflow and 500 threads for the Activity workflow, the application
handled 1000 total concurrent threads and completed 4500 samples without
request failures.

However, the average response time increased to approximately 8.4 seconds,
with a maximum response time of approximately 26.7 seconds. This indicates
that the local application remained reliable but became saturated under high
concurrent load.

An additional stress attempt using 1000 threads per workflow, or 2000 total
threads, did not complete all expected samples. Because the run was
incomplete, it was retained only as stress-test evidence and was not included
as a completed performance result.

The reusable JMeter test plan is stored at:

`jmeter/assessment3-load-test.jmx`

Generated JMeter HTML reports and result files are excluded from Git because
they are generated test artefacts. The completed reports are retained locally
for assessment evidence.

## Lighthouse Accessibility Testing

Chrome Lighthouse was used in Navigation mode with the Accessibility category
enabled.

The Operational Dashboard achieved an Accessibility score of:

`100/100`

The Wordle page also achieved an Accessibility score of:

`100/100`

During development, light and dark theme contrast issues were identified on
the Dashboard. The affected headings, cards, tables and text styling were
updated so that the interface remained readable in both themes.

The final Lighthouse audits confirmed sufficient foreground/background
contrast and appropriate document structure.

## Docker Verification

The application was successfully built and tested using Docker.

The final Docker verification confirmed:

- the Docker image built successfully
- the container started successfully
- the application was available on port 3000
- `/health` returned HTTP 200
- the main application routes loaded successfully

## Local Development Setup

Install dependencies:

```bash
npm install

## References

Apache Software Foundation. (n.d.). *Apache JMeter user manual*. 
https://jmeter.apache.org/usermanual/index.html

Docker, Inc. (n.d.). *Docker documentation*. 
https://docs.docker.com/

Google. (n.d.). *Lighthouse overview*. 
https://developer.chrome.com/docs/lighthouse/overview/

Meta Platforms, Inc. (n.d.). *React reference*. 
https://react.dev/reference/react

Microsoft. (n.d.). *Playwright documentation*. 
https://playwright.dev/docs/intro

Prisma Data, Inc. (n.d.). *Prisma ORM documentation*. 
https://www.prisma.io/docs/orm

Vercel. (n.d.). *Next.js documentation*. 
https://nextjs.org/docs

World Wide Web Consortium. (2023). *Web Content Accessibility Guidelines
(WCAG) 2.2*. 
https://www.w3.org/TR/WCAG22/