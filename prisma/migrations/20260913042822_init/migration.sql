-- CreateTable
CREATE TABLE "WordList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Word" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "hint" TEXT,
    "wordListId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Word_wordListId_fkey" FOREIGN KEY ("wordListId") REFERENCES "WordList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Phoneme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "wordId" INTEGER NOT NULL,
    CONSTRAINT "Phoneme_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "hintsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "gridSize" INTEGER,
    "timerSeconds" INTEGER,
    "outputName" TEXT,
    "settingsJson" TEXT,
    "wordListId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Activity_wordListId_fkey" FOREIGN KEY ("wordListId") REFERENCES "WordList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Phoneme_wordId_position_key" ON "Phoneme"("wordId", "position");
