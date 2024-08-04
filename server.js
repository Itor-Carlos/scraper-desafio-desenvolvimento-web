const express = require('express');
const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get(url);
        await Promise.all([
            driver.wait(until.elementLocated(By.css('.product-name')), 10000),
            driver.wait(until.elementLocated(By.css('.payment')), 10000),
            driver.wait(until.elementLocated(By.css('.swiper-wrapper')), 10000),
            driver.wait(until.elementLocated(By.css('.features--description')), 10000)
        ]);
        const [tituloElement, priceElement,imagesElements, descriptionElements] = await Promise.all([
            driver.findElement(By.css('.product-name')),
            driver.findElement(By.css('.payment')),
            driver.findElements(By.css('.swiper-wrapper img')),
            driver.findElements(By.css('.features--description'))
        ]);

        const titulo = await tituloElement.getText();
        const price = (await priceElement.getText()).toString().replace(/[^\d,R$\s]/g, '');

        const images = [];
        for (let imageElement of imagesElements) {
            const src = await imageElement.getAttribute('src');
            images.push(src);
        }

        const description = [];
        for (let descriptionElement of descriptionElements) {
            const text = await descriptionElement.getText();
            description.push(text);
        }

        res.json({ titulo, price, images, description });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
