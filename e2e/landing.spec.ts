import { expect, test } from "@playwright/test";

test.describe("Landing", () => {
  test("loads, renders the hero and reveals are wired", async ({ page }) => {
    await page.goto("/");

    // Hero copy is present
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Sistemas que piensan");
    await expect(page.getByText("UNLIMITED.").first()).toBeVisible();

    // Reveal controller flips this class on after hydration
    await expect(page.locator("html.reveal-ready")).toBeVisible();

    // Tweaks FAB is rendered and can open
    const fab = page.getByRole("button", { name: /personalización/i });
    await expect(fab).toBeVisible();
    await fab.click();
    await expect(page.getByRole("dialog", { name: /Tweaks/i })).toBeVisible();
  });

  test("process tabs respond to clicks", async ({ page }) => {
    await page.goto("/#proceso");
    const tabs = page.getByRole("tab");
    await expect(tabs.first()).toBeVisible();

    // Click the second tab and confirm aria-selected updates
    const second = tabs.nth(1);
    await second.click();
    await expect(second).toHaveAttribute("aria-selected", "true");
  });
});
