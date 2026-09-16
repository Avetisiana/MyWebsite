import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
const errors = [];
page.on('console', message => {
  if (message.type() === 'error') errors.push(message.text());
});
page.on('pageerror', error => errors.push(error.message));

await page.goto('http://localhost:3000/#tarifs', { waitUntil: 'networkidle2' });

const snapshot = () => page.evaluate(() => ({
  total: document.querySelector('[data-config-total]')?.textContent.replace(/\s/g, ''),
  languagePrice: document.querySelector('input[name="config-opt-langue"]')?.parentElement.querySelector('[data-option-price]')?.textContent.replace(/\s/g, ' '),
  rewrite: document.querySelector('input[name="config-opt-reecriture"]')?.checked,
  writing: document.querySelector('input[name="config-opt-redaction"]')?.checked,
  options: document.querySelectorAll('input[name^="config-opt-"]').length,
  photoOption: !!document.querySelector('input[name="config-opt-photos"]'),
  recap: document.querySelector('[data-config-recap]')?.textContent.replace(/\s+/g, ' ').trim(),
  aftercareIntro: document.querySelector('#config-group-aftercare')?.parentElement.querySelector('p')?.textContent,
  maintenanceCopy: document.querySelector('input[name="config-opt-maintenance"]')?.closest('label')?.textContent.replace(/\s+/g, ' ').trim(),
}));

const activate = async selector => {
  await page.$eval(selector, element => element.click());
  await new Promise(resolve => setTimeout(resolve, 500));
};

const results = {};
results.initial = await snapshot();

await activate('input[value="Essentiel"]');
results.essential = await snapshot();

await activate('input[name="config-opt-langue"]');
results.essentialLanguage = await snapshot();

await activate('input[name="config-opt-reecriture"]');
await activate('input[name="config-opt-redaction"]');
results.exclusiveWriting = await snapshot();

await activate('input[value="Premium"]');
await activate('input[name="config-opt-maintenance"]');
results.premium = await snapshot();

await page.click('[data-config-cta]');
await page.waitForFunction(() => location.hash === '#contact');
results.prefill = await page.evaluate(() => ({
  projectType: document.querySelector('#contact-project-type')?.value,
  message: document.querySelector('#contact-message')?.value,
}));

const expected = {
  initialTotal: '2990',
  initialLanguage: '+ 900 €',
  essentialLanguageTotal: '1780',
  exclusiveTotal: '2470',
  premiumTotal: '7830',
  options: 13,
};

const failures = [];
if (results.initial.total !== expected.initialTotal) failures.push('total initial');
if (results.initial.languagePrice !== expected.initialLanguage) failures.push('prix langue initial');
if (results.essentialLanguage.total !== expected.essentialLanguageTotal) failures.push('total Essentiel + langue');
if (results.exclusiveWriting.total !== expected.exclusiveTotal || results.exclusiveWriting.rewrite || !results.exclusiveWriting.writing) failures.push('exclusion rédaction');
if (results.premium.total !== expected.premiumTotal || !results.premium.recap.includes('79 €/mois')) failures.push('total Premium + récurrence');
if (results.initial.options !== expected.options || results.initial.photoOption) failures.push('inventaire options');
if (!results.initial.aftercareIntro.includes('89 €/an') || !results.initial.aftercareIntro.includes('renouvellement annuel')) failures.push('conditions hébergement');
if (!results.initial.maintenanceCopy.includes('non cumulables') || !results.initial.maintenanceCopy.includes('Hébergement séparé')) failures.push('périmètre maintenance');
const normalizedPrefill = results.prefill.message.replace(/\u00a0/g, ' ');
if (results.prefill.projectType !== 'Site multi-pages' || !normalizedPrefill.includes('7 830 € + 79 €/mois')) failures.push('préremplissage contact');
if (errors.length) failures.push('erreurs console');

const overflow = {};
for (const width of [390, 920, 1080, 1440, 1920]) {
  await page.setViewport({ width, height: 900 });
  await page.goto('http://localhost:3000/#tarifs', { waitUntil: 'networkidle2' });
  overflow[width] = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  if (overflow[width].page > overflow[width].viewport) failures.push(`débordement horizontal ${width}px`);
}

const urls = [
  '/',
  '/mentions-legales.html',
  '/confidentialite.html',
  '/videos-ia.html',
  '/contenu-reseaux-sociaux.html',
  '/audit-site-web.html',
  '/exemple-devis.html',
  '/merci.html',
  '/404.html',
];
const pageErrors = {};
for (const url of urls) {
  const checkPage = await browser.newPage();
  const currentErrors = [];
  checkPage.on('console', message => {
    if (message.type() === 'error') currentErrors.push(message.text());
  });
  checkPage.on('pageerror', error => currentErrors.push(error.message));
  await checkPage.goto(`http://localhost:3000${url}`, { waitUntil: 'networkidle2' });
  if (currentErrors.length) pageErrors[url] = currentErrors;
  await checkPage.close();
}
if (Object.keys(pageErrors).length) failures.push('erreurs pages');

console.log(JSON.stringify({ expected, results, overflow, errors, pageErrors, failures }, null, 2));
await browser.close();

if (failures.length) process.exitCode = 1;
