from flask import Flask, request, render_template_string
import json
import os

app = Flask(__name__)

# Path to store user inputs
DATA_FILE = 'messages.json'

# Ensure the data file exists
if not os.path.isfile(DATA_FILE):
    with open(DATA_FILE, 'w') as file:
        json.dump([], file)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        message = request.form.get('message')

        # Read existing messages
        with open(DATA_FILE, 'r') as file:
            messages = json.load(file)

        # Append new message
        messages.append(message)

        # Write messages back to file
        with open(DATA_FILE, 'w') as file:
            json.dump(messages, file, indent=4)

    # Read all messages
    with open(DATA_FILE, 'r') as file:
        messages = json.load(file)

    return render_template_string('''
        <html>
        <body>
            <h1>Message Board</h1>
            <form action="/" method="post">
                <label for="message">Message:</label>
                <input type="text" id="message" name="message">
                <input type="submit" value="Send">
            </form>
            <hr>
            <div>
                <h2>Messages:</h2>
                {% for message in messages %}
                    <p>{{ message }}</p>
                {% endfor %}
            </div>
        </body>
        </html>
    ''', messages=messages)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
