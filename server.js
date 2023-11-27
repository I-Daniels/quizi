// const express = require('express')
// const puppeteer = require('puppeteer')
// const bodyParser = require('body-parser')
// const sanitize = require('sanitize-filename')

// const app = express()
// const port = 3000

// app.use(express.static('public'))
// app.use(bodyParser.json())

// app.post('/submit', async (req, res) => {
// 	const {
// 		lastName,
// 		firstName,
// 		middleName,
// 		lastNameCd,
// 		firstNameCd,
// 		middleNameCd,
// 		job,
// 		comment,
// 		radioButtonsState,
// 	} = req.body

//     const browser = await puppeteer.launch();
// 	const page = await browser.newPage()

// 	await page.goto(
// 		`http://localhost:3000/pagepdf.html?lastName=${encodeURIComponent(
// 			lastName
// 		)}&firstName=${encodeURIComponent(
// 			firstName
// 		)}&middleName=${encodeURIComponent(
// 			middleName
// 		)}&lastNameCd=${encodeURIComponent(
// 			lastNameCd
// 		)}&firstNameCd=${encodeURIComponent(
// 			firstNameCd
// 		)}&middleNameCd=${encodeURIComponent(
// 			middleNameCd
// 		)}&job=${encodeURIComponent(job)}&comment=${encodeURIComponent(
// 			comment
// 		)}&radioButtonsState=${encodeURIComponent(
// 			JSON.stringify(radioButtonsState)
// 		)}`
// 	)

// 	await page.waitForTimeout(2000)

// 	const pdfBuffer = await page.pdf()

// 	await browser.close()

// 	const sanitizedFilename = sanitize(
// 		`${lastNameCd}${firstNameCd}${middleNameCd}.pdf`
// 	)
// 	const encodedFilename = encodeURIComponent(sanitizedFilename)

// 	res.setHeader('Content-Type', 'application/pdf')
// 	res.setHeader(
// 		'Content-Disposition',
// 		`attachment; filename="${encodedFilename}"`
// 	)

// 	res.send(pdfBuffer)
// })

// app.listen(port, () => console.log(`Сервер работает на порту ${port}`))

const express = require('express');
const bodyParser = require('body-parser');
const sanitize = require('sanitize-filename');
const { chromium } = require('playwright');

const app = express();

// Используйте process.env для чтения переменных среды
const port = process.env.APP_PORT || 3000;
const ip = process.env.APP_IP || 'localhost';

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
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
    radioButtonsState,
  } = req.body;

  const page = await browser.newPage();

  // Используйте переменные для формирования URL
  await page.goto(
    `http://${ip}:${port}/pagepdf.html?lastName=${encodeURIComponent(
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
    )}&radioButtonsState=${encodeURIComponent(
      JSON.stringify(radioButtonsState)
    )}`
  );

  await page.waitForTimeout(2000);

  const pdfBuffer = await page.pdf({
    margin: { top: 50, bottom: 50 }
  });

  await browser.close();

  const sanitizedFilename = sanitize(
    `${lastNameCd}-${firstNameCd}-${middleNameCd}.pdf`
  );
  console.log('Sanitized Filename:', sanitizedFilename);

  const encodedFilename = encodeURIComponent(sanitizedFilename);
  console.log('Encoded Filename:', encodedFilename);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename*=UTF-8''${encodedFilename}`
  );

  res.send(pdfBuffer);
});

app.listen(port, ip, () => console.log(`Сервер работает на порту ${port} по адресу ${ip}`));

