## Assessment 3 – Data, Observability and Testing

Assessment 3 extends the Speech Activity Builder developed in Assessments 1 and 2.
The application now includes data-driven reporting, operational monitoring,
usage statistics, alerts, automated end-to-end testing, load testing and
accessibility evaluation.

### Assessment 3 Features

- Data-driven dashboard
- System health monitoring through `/health`
- Wordle and Word Search activity statistics
- Successful and failed generation counts
- Average time-on-page metrics
- Most-used activity type reporting
- Database-backed usage records
- Operational alerts and warnings
- Reporting views
- Playwright end-to-end tests
- Apache JMeter load testing
- Lighthouse accessibility testing

### Health Check

The application exposes:

`GET /health`

A healthy application returns HTTP status `200 OK`.

### JMeter Load Testing

Apache JMeter was used to test the builder and activity workflows at
multiple staged traffic levels.

| Stage | Builder Threads | Activity Threads | Total Threads | Samples | Average | Maximum | Error Rate |
|---|---:|---:|---:|---:|---:|---:|---:|
| Baseline | 1 | 1 | 2 | 9 | 50.44 ms | 106 ms | 0.00% |
| Low | 10 | 10 | 20 | 90 | 40 ms | 111 ms | 0.00% |
| Medium | 100 | 100 | 200 | 900 | 38 ms | 161 ms | 0.00% |
| High | 500 | 500 | 1000 | 4500 | 8435.21 ms | 26738 ms | 0.00% |

The application remained reliable through the highest completed load stage,
with a 0% request failure rate. Performance degraded substantially at 1000
total threads, where average response time increased to approximately 8.4
seconds and maximum response time reached approximately 26.7 seconds. This
indicates that the local application environment became saturated under heavy
concurrent load.

The test plan covers:

- `/health`
- `/manage`
- `/api/word-lists`
- `/api/words`
- `/api/activities`
- `/wordle`
- `/word-search`

The JMeter test plan is stored in:

`jmeter/assessment3-load-test.jmx`

results-500 = 500 threads per workflow / 1000 total threads


# Speech Activity Builder – Assessment 2

## Overview

Speech Activity Builder is a Next.js application for creating phoneme-based
learning activities for Speech Pathology teaching and practice.

Assessment 2 extends the original frontend application with a backend,
persistent database storage, CRUD operations, validation, API routes and
Docker support.

## GitHub Repository

Repository: https://github.com/Tuong-An-Luu/speech-activity-builder-a2

## Technologies

- Next.js
- React
- TypeScript
- Prisma ORM 7
- SQLite
- Zod
- Docker

## Features

- Create and manage word lists
- Create, read, update and delete words
- Store ordered phonemes
- Support multi-character phonemes such as əʊ
- Store word hints
- Create and manage activity configurations
- Load saved words into the Wordle builder
- Load saved word lists into the Word Search builder
- Generate standalone HTML activities
- Backend validation using Zod
- Health-check endpoint
- Docker container support
- Persistent SQLite storage using a Docker volume

## Database

The Prisma schema contains four main models:

- WordList
- Word
- Phoneme
- Activity

Words belong to word lists and each word can contain multiple ordered phonemes.

Activity records store configuration including activity type, difficulty,
hints, grid size, timer settings, output filename and associated word list.

## Local Setup

Install dependencies:

```bash
npm install