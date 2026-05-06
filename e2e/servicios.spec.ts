import { expect, test } from "@playwright/test";

test.describe("Servicios", () => {
  test("hover/click swaps the detail card", async ({ page }) => {
    await page.goto("/servicios");

    const rows = page.locator(".srv-row");
    await expect(rows.first()).toBeVisible();
    await expect(rows).toHaveCount(8);

    // Click the third row → its detail card should be active
    await rows.nth(2).click();
    const detail = page.locator(".srv-detail-card[data-detail='2']");
    await expect(detail).toHaveClass(/active/);
  });
});
