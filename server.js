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
            driver.wait(until.elementLocated(By.css('.image-thumb')), 10000),
            driver.wait(until.elementLocated(By.css('.features--description')), 10000),
            driver.wait(until.elementLocated(By.css('.price-box__saleInCents')), 10000)
        ]);
        const [tituloElement, imagesElements, descriptionElements, priceElements] = await Promise.all([
            driver.findElement(By.css('.product-name')),
            driver.findElements(By.css('.image-thumb')),
            driver.findElements(By.css('.features--description')),
            driver.findElements(By.css('.price-box__saleInCents'))
        ]);

        const titulo = await tituloElement.getText();
        const array_prices = await Promise.all(priceElements.map(price => price.getText()));
        const price = array_prices[1].toString().replace(/[^\d,R$\s]/g, '');
        const images = await Promise.all(imagesElements.map(imageElement => imageElement.getAttribute('src')));
        const description = await Promise.all(descriptionElements.map(descriptionElement => descriptionElement.getText()));
        
        console.log({ titulo, price, images, description })
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
