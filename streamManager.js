// Required modules
const speech = require("@google-cloud/speech");
const { play, say, pause } = require('./twilioFunctions');
const Assistant = require("./assistant");

const googleAppCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// Google Speech-to-Text client initialization
const speechClient = new speech.SpeechClient({ keyFilename: googleAppCredentials });

// Google Speech-to-Text options
const speechClientOptions = {
  config: {
    encoding: "MULAW",
    sampleRateHertz: 8000,
    languageCode: "en-US", // Change language if needed
  },
  interimResults: true,
};

// URL for typing noises audio file
const typingNoiseUrl = "https://apmartinez.com/tmp/typing-6458.mp3"; 

// StreamManager function manages WebSocket connections
module.exports = function streamManager(wss) {

  wss.on('connection', handleNewConnection); // Handle new connections

  // Handle new WebSocket connection
  function handleNewConnection(ws) {
    let callSid,
        assistant,
        transcript,
        recognizer;

    const tearDown = (error) => {
      if (error) {
        console.log("Unexpected error occurred:", error);
      }
      messages = null;
      transcript = null;
      callSid = null;
      if (recognizer) {
        recognizer.end();
        recognizer.destroy();
        recognizer = null;
      }
      if (assistant) {
        assistant.destroy();
        assistant = null;
      }
      if (ws) {
        ws.terminate();
        ws = null;
      }
    };

    const onGoogleData = async (data) => {
      try {
        const result = data.results?.[0];
        if (!result) return;
        const newTranscript = result.alternatives[0].transcript;
        if (result.isFinal) {
          play(callSid, typingNoiseUrl); // play typing noise so the user knows somthing is happening
          const completion = await assistant.chatCompletion(newTranscript); // request a chat completion
          say(callSid, completion)
          transcript = null;
        } else if (transcript) {
          if (!transcript) {
            pause(callSid); // Pause if user starts talking
          }
          transcript = newTranscript; // Update transcript
        }
      } catch (e) {
        console.error("Error handling google stream:", e);
      }
    };

    ws.on('message', (eventData) => {
      const jsonData = JSON.parse(eventData); // Parse incoming JSON data
      switch (jsonData.event) {
        case "connected":
          console.log(`A new call has connected.`);
          break;
        case "start":
          console.log(`Starting Media Stream ${jsonData.streamSid}`);
          callSid = jsonData.start.callSid;
          assistant = new Assistant();
          recognizer = speechClient.streamingRecognize(speechClientOptions);
          recognizer.on('error', (err) => {console.log('recognizer error', err)});
          recognizer.on('data', onGoogleData);
          break;
        case "media":
          recognizer.write(jsonData.media.payload); // Push media data to assistant
          break;
        case "stop":
          console.log(`Call Has Ended`);
          tearDown(); // Clean up on call end
          break;
      }
    }); // Handle incoming messages
    ws.on('close', tearDown); // Clean up on connection close
    ws.on('error', tearDown); // Handle errors
  }
}