# Speech Activity Builder – Assessment 2

## Overview

Speech Activity Builder is a Next.js application for creating phoneme-based
learning activities for Speech Pathology teaching and practice.

Assessment 2 extends the original frontend application with a backend,
persistent database storage, CRUD operations, validation, API routes and
Docker support.

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