import { test, expect } from '@playwright/test';

test('test barcos con dos usuarios', async ({ browser }) => {
                                                  
  //await page.goto('http://localhost:3000/');
  //https://proyecto22pluscd-vyqothtfta-ew.a.run.app/
  //await page.goto('https://proyecto22pluscd-vyqothtfta-ew.a.run.app/');

  //await browser.browserType

  //Create two isolated browser contexts
  const pepeContext = await browser.newContext();
  const juanContext = await browser.newContext();


  const pepePage = await pepeContext.newPage();
  const juanPage = await juanContext.newPage();


  await pepePage.goto('http://localhost:3000/');
  await juanPage.goto('http://localhost:3000/');

  await pepePage.getByPlaceholder('Introduce tu nick (max 6 letras)').click();
  await pepePage.getByPlaceholder('Introduce tu nick (max 6 letras)').fill('pepe');
  await pepePage.getByRole('button', { name: 'Iniciar sesión' }).click();
  await pepePage.locator('html').click();
  await pepePage.locator('html').click();


  await pepePage.getByRole('button', { name: 'Crear partida' }).click();
  await pepePage.locator('html').click();

  await juanPage.getByPlaceholder('Introduce tu nick (max 6 letras)').click();
  await juanPage.getByPlaceholder('Introduce tu nick (max 6 letras)').fill('juan');
  await juanPage.getByRole('button', { name: 'Iniciar sesión' }).click();
  await juanPage.locator('html').click();
  await juanPage.locator('html').click();
  await juanPage.getByRole('link', { name: 'Nick propietario: pepe' }).click();

  //Disparos y colocar
  await pepePage.getByText('b1-1').click();
  await pepePage.locator('.grid-cell').first().click();
  await pepePage.getByText('b1-2').click();
  await pepePage.locator('.grid > div:nth-child(11)').first().click();
  await pepePage.getByText('b2').click();
  await pepePage.locator('.grid > div:nth-child(21)').first().click();
  await pepePage.getByText('b4').click();
  await pepePage.locator('.grid > div:nth-child(31)').first().click();
  await pepePage.getByText('b5').click();
  await pepePage.locator('.grid > div:nth-child(41)').first().click();


  await juanPage.getByText('b1-1').click();
  await juanPage.locator('.grid-cell').first().click();
  await juanPage.getByText('b1-2').click();
  await juanPage.locator('.grid > div:nth-child(11)').first().click();
  await juanPage.getByText('b2').click();
  await juanPage.locator('.grid > div:nth-child(21)').first().click();
  await juanPage.getByText('b4').click();
  await juanPage.locator('.grid > div:nth-child(31)').first().click();
  await juanPage.getByText('b5').click();
  await juanPage.locator('.grid > div:nth-child(41)').first().click();

  await pepePage.getByRole('button', { name: 'Cerrar' }).click();
  await juanPage.getByRole('button', { name: 'Cerrar' }).click();

  //Disparos
  await pepePage.locator('div:nth-child(3) > .grid > div').first().click();
  await pepePage.locator('div:nth-child(3) > .grid > div:nth-child(11)').click();
  await pepePage.locator('div:nth-child(3) > .grid > div:nth-child(21)').click();
  await pepePage.locator('div:nth-child(3) > .grid > div:nth-child(22)').click();
  await pepePage.locator('div:nth-child(3) > .grid > div:nth-child(31)').click();
  await pepePage.locator('div:nth-child(3) > .grid > div:nth-child(32)').click();
  await pepePage.locator('div:nth-child(3) > .grid > div:nth-child(33)').click();
  await pepePage.locator('div:nth-child(3) > .grid > div:nth-child(34)').click();
  await pepePage.locator('div:nth-child(3) > .grid > div:nth-child(41)').click();
  await pepePage.locator('div:nth-child(3) > .grid > div:nth-child(42)').click();
  await pepePage.locator('div:nth-child(3) > .grid > div:nth-child(43)').click();
  await pepePage.locator('div:nth-child(3) > .grid > div:nth-child(44)').click();
  await pepePage.locator('div:nth-child(3) > .grid > div:nth-child(45)').click();
 
  await pepePage.getByRole('button', { name: 'Cerrar' }).click();
  await juanPage.getByRole('button', { name: 'Cerrar' }).click();

  await pepePage.getByRole('button', { name: 'Salir' }).click();
  await juanPage.getByRole('button', { name: 'Salir' }).click();

});