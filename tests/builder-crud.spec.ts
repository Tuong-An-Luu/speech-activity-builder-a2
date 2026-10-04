import { test, expect } from "@playwright/test";

test("builder can create, edit and delete an activity", async ({
  page,
}) => {
  const activityName = `Playwright Activity ${Date.now()}`;
  const updatedActivityName = `${activityName} Updated`;

  // ---------------------------------
  // OPEN MANAGE ACTIVITIES
  // ---------------------------------

  await page.goto("/manage/activities");

  await expect(
    page.getByRole("heading", {
      name: "Manage Activities",
    }),
  ).toBeVisible();

  const createSection = page
    .getByRole("heading", {
      name: "Create Activity",
    })
    .locator("..");

  const wordListSelect =
    createSection.getByLabel("Word list");

  await expect(wordListSelect).toBeVisible();

  // Wait for the database-backed word list to appear.
  await expect(
    wordListSelect.getByRole("option", {
      name: "Initial S Practice",
    }),
  ).toBeAttached({
    timeout: 15000,
  });

  // ---------------------------------
  // CREATE
  // ---------------------------------

  await createSection
    .getByLabel("Activity name")
    .fill(activityName);

  await wordListSelect.selectOption({
    label: "Initial S Practice",
  });

  await createSection
    .getByLabel("Activity type")
    .selectOption("WORDLE");

  await createSection
    .getByLabel("Difficulty")
    .selectOption("EASY");

  const createResponsePromise =
    page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname ===
          "/api/activities" &&
        response.request().method() === "POST",
    );

  await createSection
    .getByRole("button", {
      name: "Create Activity",
    })
    .click();

  const createResponse =
    await createResponsePromise;

  const createBody =
    await createResponse.text();

  expect(
    createResponse.status(),
    `POST /api/activities failed: ${createBody}`,
  ).toBe(201);

  await expect(
    page.getByRole("heading", {
      name: activityName,
      exact: true,
    }),
  ).toBeVisible();

  // ---------------------------------
  // EDIT
  // ---------------------------------

  const createdActivityHeading =
    page.getByRole("heading", {
      name: activityName,
      exact: true,
    });

  const activityCard =
    createdActivityHeading.locator("..");

  await activityCard
    .getByRole("button", {
      name: "Edit",
    })
    .click();

  const editNameInput =
    page.getByLabel("Activity name").last();

  await expect(
    editNameInput,
  ).toBeVisible();

  await editNameInput.fill(
    updatedActivityName,
  );

  const updateResponsePromise =
    page.waitForResponse(
      (response) => {
        const path =
          new URL(response.url()).pathname;

        return (
          /^\/api\/activities\/\d+$/.test(
            path,
          ) &&
          response.request().method() ===
            "PUT"
        );
      },
    );

  await page
    .getByRole("button", {
      name: "Save Changes",
    })
    .click();

  const updateResponse =
    await updateResponsePromise;

  const updateBody =
    await updateResponse.text();

  expect(
    updateResponse.status(),
    `PUT activity failed: ${updateBody}`,
  ).toBe(200);

  // Verify the UI now shows the edited name.
  await expect(
    page.getByRole("heading", {
      name: updatedActivityName,
      exact: true,
    }),
  ).toBeVisible({
    timeout: 10000,
  });

  // Verify the old name has disappeared.
  await expect(
    page.getByRole("heading", {
      name: activityName,
      exact: true,
    }),
  ).toHaveCount(0);

  // ---------------------------------
  // DELETE
  // ---------------------------------

  const updatedActivityHeading =
    page.getByRole("heading", {
      name: updatedActivityName,
      exact: true,
    });

  const updatedActivityCard =
    updatedActivityHeading.locator("..");

  page.once(
    "dialog",
    async (dialog) => {
      expect(dialog.type()).toBe(
        "confirm",
      );

      await dialog.accept();
    },
  );

  const deleteResponsePromise =
    page.waitForResponse(
      (response) => {
        const path =
          new URL(response.url()).pathname;

        return (
          /^\/api\/activities\/\d+$/.test(
            path,
          ) &&
          response.request().method() ===
            "DELETE"
        );
      },
    );

  await updatedActivityCard
    .getByRole("button", {
      name: "Delete",
    })
    .click();

  const deleteResponse =
    await deleteResponsePromise;

  const deleteBody =
    await deleteResponse.text();

  expect(
    deleteResponse.status(),
    `DELETE activity failed: ${deleteBody}`,
  ).toBe(200);

  await expect(
    page.getByRole("heading", {
      name: updatedActivityName,
      exact: true,
    }),
  ).toHaveCount(0);
});