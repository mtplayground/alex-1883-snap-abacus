import { expect, test, type Locator, type Page } from '@playwright/test';

async function boundingBox(locator: Locator) {
  const box = await locator.boundingBox();

  if (!box) {
    throw new Error('Expected locator to have a visible bounding box.');
  }

  return box;
}

async function dragBeadAcrossRod(
  page: Page,
  rodIndex: number,
  beadIndex: number,
  targetRatio: number,
) {
  const bead = page.getByTestId(`bead-${rodIndex}-${beadIndex}`);
  const rod = page.getByTestId(`rod-${rodIndex}`);
  const beadBox = await boundingBox(bead);
  const rodBox = await boundingBox(rod);
  const startX = beadBox.x + beadBox.width / 2;
  const startY = beadBox.y + beadBox.height / 2;
  const targetX = rodBox.x + rodBox.width * targetRatio;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move((startX + targetX) / 2, startY, { steps: 6 });
  await expect(bead).toHaveAttribute('data-dragging', 'true');
  await page.mouse.move(targetX, startY, { steps: 14 });
  await page.mouse.up();

  return bead;
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('renders the complete abacus without horizontal clipping', async ({
  page,
}) => {
  await expect(page.getByTestId('abacus-frame')).toBeVisible();
  await expect(page.getByTestId('count-value')).toHaveText('0');
  await expect(page.locator('[data-testid^="rod-"]')).toHaveCount(10);
  await expect(page.locator('[data-testid^="bead-"]')).toHaveCount(100);

  const hasNoHorizontalOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth <= window.innerWidth + 1;
  });

  expect(hasNoHorizontalOverflow).toBe(true);

  for (const testId of ['abacus-frame', 'count-readout']) {
    const box = await boundingBox(page.getByTestId(testId));

    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(
      await page.evaluate(() => window.innerWidth + 1),
    );
  }
});

test('dragging a bead updates count, squashes while grabbed, and settles after bounce', async ({
  page,
}) => {
  const bead = await dragBeadAcrossRod(page, 0, 9, 0.88);

  await expect(page.getByTestId('count-value')).toHaveText('1');
  await expect(bead).toHaveAttribute('data-settling', 'true');
  await expect(bead).toHaveAttribute('data-dragging', 'false');
  await expect(bead).toHaveAttribute('data-settling', 'false', {
    timeout: 1_200,
  });
});

test('rapid drag pushes neighboring beads without crossing the rod bounds', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await dragBeadAcrossRod(page, 0, 0, 0.92);
  await expect(page.getByTestId('count-value')).not.toHaveText('0');
  await page.waitForTimeout(650);

  const rodBox = await boundingBox(page.getByTestId('rod-0'));
  const centers = await page
    .locator('[data-testid^="bead-0-"]')
    .evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return rect.left + rect.width / 2;
      }),
    );

  for (let index = 1; index < centers.length; index += 1) {
    expect(centers[index]).toBeGreaterThan(centers[index - 1]);
  }

  expect(centers[0]).toBeGreaterThanOrEqual(rodBox.x - 1);
  expect(centers.at(-1)).toBeLessThanOrEqual(rodBox.x + rodBox.width + 1);
  expect(consoleErrors).toEqual([]);
});

test('mobile touch targets keep touch dragging enabled', async ({ page }) => {
  const bead = page.getByTestId('bead-0-0');
  const touchAction = await bead.evaluate((element) => {
    return window.getComputedStyle(element).touchAction;
  });

  expect(touchAction).toBe('none');
});
