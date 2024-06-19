# Voice Assistant Integration with WebSocket and Twilio

This project demonstrates the integration of a voice assistant using WebSocket for real-time streaming and Twilio for telephony functionalities. The assistant leverages OpenAI's GPT models for natural language processing.
Components
## app.js

This file sets up an Express server with WebSocket capabilities and serves a static HTML file. It also handles POST requests for initiating voice calls with Twilio.

## assistant.js

This module defines the Assistant class responsible for interacting with OpenAI's API to generate responses based on user prompts.

## streamManager.js

Manages WebSocket connections for real-time audio streaming using Google's Speech-to-Text API. It also coordinates with the Assistant to provide responses during live calls.

## twilioFunctions.js

Contains functions for modifying ongoing calls with Twilio's VoiceResponse API, including speaking text, playing audio, and pausing calls.
Setup

# Usage

## Clone the repository:

``` bash
git clone <repository_url>
cd <repository_name>
```

## Install dependencies:

``` bash
npm install
```

## Set up environment variables:

```
OPENAI_API_KEY: API key for OpenAI's GPT models.
GOOGLE_APPLICATION_CREDENTIALS: Path to Google Cloud service account credentials.
TWILIO_ACCOUNT_SID: Account SID from Twilio.
TWILIO_AUTH_TOKEN: Auth token from Twilio.
```

Ensure these variables are set in your environment or in a .env file at the root of your project.

## Start the server:

``` bash
node app.js
```

## Ngrok setup for testing:

Download and install ngrok from ngrok.com.

Expose your local server to the internet:

``` bash

    ngrok http 3000
```

Note the HTTPS forwarding URL provided by ngrok (https://<random_string>.ngrok.io). Update your Twilio webhook URL (/voice) to use this URL for testing.

# Twilio phone endpoint

Initiate a voice call to <ngrokUrl>/voice (webhook for Twilio voice call) to start interacting with the assistant.

# Notes

    This project assumes prior setup and configuration of services such as OpenAI, Google Cloud Speech-to-Text, and Twilio.
    Ensure all necessary environment variables are securely configured.
    Testing with ngrok allows you to simulate real-world Twilio webhooks over HTTPS.