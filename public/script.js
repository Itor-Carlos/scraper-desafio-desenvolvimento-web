document.getElementById('scrapeButton').addEventListener('click', async () => {
    const url = document.getElementById('urlInput').value;
    
    if (url) {
        try {
            const response = await fetch(`/scrape?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            displayResult(data);
        } catch (error) {
            console.error('Error fetching scrape data:', error);
        }
    } else {
        alert('Please enter a valid URL');
    }
});

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    
    const { titulo, price, images, description } = data;

    const html = `
        <h2>${titulo}</h2>
        <p><strong>Price:</strong> ${price}</p>
        <div>
            <strong>Images:</strong>
            <div class="images">
                ${images.map(src => `<img src="${src}" alt="Image" style="max-width: 200px; margin: 10px;">`).join('')}
            </div>
        </div>
        <div>
            <strong>Description:</strong>
            <ul>
                ${description.map(text => `<li>${text}</li>`).join('')}
            </ul>
        </div>
    `;

    resultDiv.innerHTML = html;
}
