import { test, expect } from "@playwright/test";

type UsageEvent = {
  id: number;
  eventType: string;
  activityType: string | null;
  pagePath: string | null;
  durationMs: number | null;
  message: string | null;
  createdAt: string;
};

test("user can generate and download a Wordle activity", async ({
  page,
  request,
}) => {
  // ---------------------------------
  // GET CURRENT USAGE EVENT ID
  // ---------------------------------

  const beforeResponse =
    await request.get("/api/usage");

  expect(beforeResponse.ok()).toBeTruthy();

  const beforeEvents =
    (await beforeResponse.json()) as UsageEvent[];

  const latestEventId =
    beforeEvents.length > 0
      ? Math.max(
          ...beforeEvents.map(
            (event) => event.id,
          ),
        )
      : 0;

  // ---------------------------------
  // OPEN WORDLE PAGE
  // ---------------------------------

  await page.goto("/wordle");

  await expect(
    page.getByRole("heading", {
      name: "Create a Phoneme Wordle",
    }),
  ).toBeVisible();

  // ---------------------------------
  // CONFIGURE WORDLE
  // ---------------------------------

  await page
    .getByLabel("Activity title")
    .fill("Playwright Wordle Test");

  await page
    .getByLabel("Phoneme word")
    .fill("/sʌn/");

  await page
    .getByLabel("English equivalent")
    .fill("sun");

  await page
    .getByLabel("Phoneme hint")
    .fill("Something seen in the sky");

  await page
    .getByLabel("Number of attempts")
    .fill("6");

  await page
    .getByLabel("Difficulty")
    .selectOption("easy");

  // ---------------------------------
  // GENERATE AND VERIFY DOWNLOAD
  // ---------------------------------

  const downloadPromise =
    page.waitForEvent("download");

  await page
    .getByRole("button", {
      name: "Generate Wordle HTML",
    })
    .click();

  const download =
    await downloadPromise;

  expect(
    download.suggestedFilename(),
  ).toBe("phoneme-wordle.html");

  // ---------------------------------
  // VERIFY REAL MONITORING EVENT
  // ---------------------------------

  await expect
    .poll(
      async () => {
        const response =
          await request.get("/api/usage");

        if (!response.ok()) {
          return false;
        }

        const events =
          (await response.json()) as UsageEvent[];

        return events.some(
          (event) =>
            event.id > latestEventId &&
            event.eventType ===
              "GENERATION_SUCCESS" &&
            event.activityType ===
              "WORDLE",
        );
      },
      {
        timeout: 10000,
      },
    )
    .toBe(true);
});