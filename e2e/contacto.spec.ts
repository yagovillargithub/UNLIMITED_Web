import { expect, test } from "@playwright/test";

test.describe("Contacto", () => {
  test("submits the form happy path and shows success state", async ({ page }) => {
    // Stub the API so the test doesn't depend on Resend being configured
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, ref: "UNL-1234" }),
      });
    });

    await page.goto("/contacto");

    await page.getByLabel(/¿Cómo se llama\?/).fill("Marta López");
    await page.getByLabel(/Su email de trabajo/).fill("marta@example.com");
    await page.getByLabel(/Empresa/).fill("Acme S.L.");
    await page.getByRole("button", { name: "RAG" }).click();
    await page
      .getByLabel(/Cuéntenos un poco más/)
      .fill("Tenemos 10.000 documentos legales que queremos hacer buscables con IA.");
    await page.getByRole("radio", { name: "Este mes" }).click();

    await page.getByRole("button", { name: /Enviar mensaje/i }).click();

    await expect(page.getByText("Mensaje enviado.")).toBeVisible();
    await expect(page.getByText("UNL-1234")).toBeVisible();
  });

  test("shows live validation errors on invalid input", async ({ page }) => {
    await page.goto("/contacto");

    const email = page.getByLabel(/Su email de trabajo/);
    await email.fill("not-an-email");
    await email.blur();

    await expect(page.getByText("Email no válido.")).toBeVisible();
  });
});
