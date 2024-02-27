const express = require('express');
const bodyParser = require('body-parser');
const sanitize = require('sanitize-filename');
const { chromium } = require('playwright');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
  try {
    const browser = await chromium.launch({
      headless: true,
    });

  const {
    lastName,
    firstName,
    middleName,
    lastNameCd,
    firstNameCd,
    middleNameCd,
    job,
    comment,
    averageValues,
    resultDivs,
  } = req.body;

  const page = await browser.newPage();
  await page.goto(
    `http://localhost:3000/pagepdf.html?lastName=${encodeURIComponent(
      lastName
    )}&firstName=${encodeURIComponent(
      firstName
    )}&middleName=${encodeURIComponent(
      middleName
    )}&lastNameCd=${encodeURIComponent(
      lastNameCd
    )}&firstNameCd=${encodeURIComponent(
      firstNameCd
    )}&middleNameCd=${encodeURIComponent(
      middleNameCd
    )}&job=${encodeURIComponent(job)}&comment=${encodeURIComponent(
      comment
    )}&averageValues=${encodeURIComponent(JSON.stringify(averageValues)
    )}&resultDivs=${encodeURIComponent(JSON.stringify(resultDivs))}`
  );

  await page.waitForTimeout(2000);

  const pdfBuffer = await page.pdf({
    margin: { top: 50, bottom: 50 },
  });

  await browser.close();

  const sanitizedFilename = sanitize(`${lastNameCd}_LM.pdf`);
  const encodedFilename = encodeURIComponent(sanitizedFilename);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${encodedFilename}"`
  );

  res.send(pdfBuffer);
} catch (error) {
  console.error('Ошибка обработки запроса:', error);
  res.status(500).send('Internal Server Error');
}
});

app.listen(port, () => console.log(`Сервер работает на порту ${port}`));

app.post('/logToServer', (req, res) => {
  const logData = req.body;

  console.log('Received log data:', logData);

  res.sendStatus(200);
});

app.post('/submitHR', async (req, res) => {
  try {
    const browser = await chromium.launch({
      headless: true,
    });

    const {
      lastName,
      firstName,
      middleName,
      lastNameCd,
      firstNameCd,
      middleNameCd,
      job,
      comment,
      averageValues,
      resultDivs,
    } = req.body;

    const page = await browser.newPage();
    await page.goto(
      `http://localhost:3000/pagepdfHR.html?lastName=${encodeURIComponent(
        lastName
      )}&firstName=${encodeURIComponent(
        firstName
      )}&middleName=${encodeURIComponent(
        middleName
      )}&lastNameCd=${encodeURIComponent(
        lastNameCd
      )}&firstNameCd=${encodeURIComponent(
        firstNameCd
      )}&middleNameCd=${encodeURIComponent(
        middleNameCd
      )}&job=${encodeURIComponent(job)}&comment=${encodeURIComponent(
        comment
      )}&averageValues=${encodeURIComponent(JSON.stringify(averageValues)
      )}&resultDivs=${encodeURIComponent(JSON.stringify(resultDivs))}`
    );

    await page.waitForTimeout(2000);

    const pdfBuffer = await page.pdf({
      margin: { top: 50, bottom: 50 },
    });

    await browser.close();

    const sanitizedFilename = sanitize(`${lastNameCd}_HR.pdf`);
    const encodedFilename = encodeURIComponent(sanitizedFilename);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodedFilename}"`
    );

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Ошибка обработки запроса:', error);
    res.status(500).send('Internal Server Error');
  }
});