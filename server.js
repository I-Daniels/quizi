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
const port = 3000;

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
    `${lastNameCd}.pdf`
  );
  const encodedFilename = encodeURIComponent(sanitizedFilename);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="${encodedFilename}"`
  );

  res.send(pdfBuffer);
});

app.listen(port, () => console.log(`Сервер работает на порту ${port}`));

