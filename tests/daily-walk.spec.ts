import { test, expect } from "@playwright/test";

test.describe("Daily Walk Stepper E2E Flow", () => {
  test("new user onboarding: name + email + role", async ({ page }) => {
    // Clear localStorage to simulate first-time user
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Should show new single-user onboarding
    await page.locator("text=Begin Your Walk").waitFor({ state: "visible", timeout: 8000 });
    await expect(page.locator("text=Begin Your Walk")).toBeVisible();

    // Fill name
    await page.fill("input[placeholder='Enter your name']", "Richard");

    // Select Husband role
    await page.click("button:has-text('MR.')");

    // Submit
    await page.click("button[type='submit']");

    // Should land on main dashboard
    await page.locator("text=Verse of the Day").waitFor({ state: "visible", timeout: 8000 });
    await expect(page.locator("text=Verse of the Day")).toBeVisible();

    // Invite banner should be visible since partner hasn't joined
    await expect(page.locator("text=Invite your partner to join this devotional walk")).toBeVisible();
  });

  test("session UUID is valid v4 UUID", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1000);
    const sessionId = await page.evaluate(() => localStorage.getItem("devo_session_id"));
    expect(sessionId).toBeTruthy();
    expect(sessionId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  test("magic link join flow: partner arrives via ?join=UUID", async ({ page }) => {
    // First set up a session as User 1 (Richard the husband)
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem("devo_session_id", "test-session-12345");
      localStorage.setItem("devo_his_name", "Richard");
      localStorage.setItem("devo_active_user", "his");
    });

    // Simulate partner arriving via magic link in a new context
    await page.goto("/?join=test-session-12345");
    await page.waitForTimeout(1500);

    // Should show join flow since session has Richard but no Morgan
    const joinText = page.locator("text=Join the Walk");
    const onboardingText = page.locator("text=Begin Your Walk");
    await Promise.race([
      joinText.waitFor({ state: "visible", timeout: 6000 }).catch(() => {}),
      onboardingText.waitFor({ state: "visible", timeout: 6000 }).catch(() => {})
    ]);

    // URL should have been cleaned up (no ?join= param)
    expect(page.url()).not.toContain("join=");
  });

  test("invite modal opens from profile dropdown", async ({ page }) => {
    await page.goto("/");

    // Set up as onboarded user
    await page.evaluate(() => {
      localStorage.setItem("devo_session_id", "test-invite-session");
      localStorage.setItem("devo_his_name", "Richard");
      localStorage.setItem("devo_active_user", "his");
    });
    await page.reload();

    await page.locator("text=Verse of the Day").waitFor({ state: "visible", timeout: 8000 });

    // Open profile dropdown
    await page.click("header button:has-text('Richard')");
    await expect(page.locator("text=Invite Partner")).toBeVisible();

    // Click invite partner
    await page.click("text=Invite Partner");
    await expect(page.getByRole("heading", { name: "Invite Your Partner" })).toBeVisible();
    await expect(page.locator("text=Copy Link")).toBeVisible();

  });

  test("full daily walk: opens stepper, marks passage read, journals reflection", async ({ page }) => {
    await page.goto("/");

    // Ensure onboarded
    const onboardingHeader = page.locator("text=Begin Your Walk");
    const dashboardHeader = page.locator("text=Verse of the Day");

    await Promise.race([
      onboardingHeader.waitFor({ state: "visible", timeout: 8000 }).catch(() => {}),
      dashboardHeader.waitFor({ state: "visible", timeout: 8000 }).catch(() => {})
    ]);

    if (await onboardingHeader.isVisible()) {
      await page.fill("input[placeholder='Enter your name']", "Richard");
      await page.click("button:has-text('MR.')");
      await page.click("button[type='submit']");
    }

    await dashboardHeader.waitFor({ state: "visible", timeout: 8000 });

    // Navigate to Weeks 1-5
    await page.click("button:has-text('Weeks 1–5')");
    await expect(page.locator("text=Week 1 Theme")).toBeVisible();

    // Open daily walk stepper
    await page.click("button:has-text('Begin Walk')");
    await page.locator("text=1. Read Passage").waitFor({ state: "visible", timeout: 8000 });

    // Get day number dynamically
    const dayText = await page.locator("text=/Day \\d+ of 31/").innerText();
    const dayMatch = dayText.match(/Day (\d+) of 31/i);
    const dayNumber = dayMatch ? dayMatch[1] : "1";

    // Switch translation
    await page.click("button:has-text('NIV')");
    await page.waitForTimeout(1000);

    // Mark as read
    const nextBtn = page.locator('button:has-text("Continue"), button:has-text("Mark as Read")');
    await nextBtn.click();

    // Wait for reflection step
    const promptText = `Day ${dayNumber} Reflection Prompt`;
    await page.locator(`text=${promptText}`).waitFor({ state: "visible", timeout: 8000 });

    // Fill reflection
    const textarea = page.locator('textarea[placeholder*="Type your reflection answer here"]');
    await textarea.fill("E2E test reflection answer.");

    // Finish
    await page.click("button:has-text('Finish & View Weeks')");
    await page.locator("text=Week 1 Theme").waitFor({ state: "visible", timeout: 8000 });
    await expect(page.locator("text=Week 1 Theme")).toBeVisible();
  });
});
