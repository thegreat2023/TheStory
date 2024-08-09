const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'messages.json');

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Ensure the data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

// Helper function to extract the first two numbers of the IP address
function getIpPrefix(ipAddress) {
    return ipAddress.split('.').slice(0, 2).join('.');
}

app.get('/', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) throw err;
        const messages = JSON.parse(data);

        // Construct the HTML with the messages
        let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Message Board</title>
            </head>
            <body>
                <h1>Message Board</h1>
                <form action="/" method="POST">
                    <label for="message">Enter your message:</label>
                    <input type="text" id="message" name="message" required>
                    <button type="submit">Send</button>
                    <button type="button" onclick="href='great.html'">Go</button>
                </form>
                <h2>Messages:</h2>
                <ul>`;

        // Loop through each IP prefix and its messages
        for (const ipPrefix in messages) {
            messages[ipPrefix].forEach((entry) => {
                html += `<li>${entry}</li>`;
            });
        }

        html += `
                </ul>
            </body>
            </html>
        `;

        res.send(html);
    });
});

// Handle message submission
app.post('/', (req, res) => {
    const message = req.body.message;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const ipPrefix = getIpPrefix(ipAddress);

    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) throw err;
        const messages = JSON.parse(data);

        if (!messages[ipPrefix]) {
            messages[ipPrefix] = [];
        }

        const entry = `${ipAddress}: ${message}`;
        messages[ipPrefix].push(entry);

        fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 4), (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
