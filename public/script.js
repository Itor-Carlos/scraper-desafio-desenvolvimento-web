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
        <div class="content-container">
            <h2>Titulo: ${titulo}</h2>
            <p><strong>Preço:</strong> ${price}</p>
            <div>
                <strong>Imagens:</strong>
                <div class="images">
                    ${images.map(src => `<img src="${src}" alt="Image">`).join('')}
                </div>
            </div>
            <div>
                <strong>Descrição:</strong>
                <ul class="text-description">
                    ${description.map(text => `<li>${text}</li>`).join('')}
                </ul>
            </div>
        </div>
    `;



    resultDiv.innerHTML = html;
}
