const twilio = require('twilio');

// Twilio VoiceResponse for generating TwiML
const VoiceResponse = twilio.twiml.VoiceResponse;

// Environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Twilio client initialization
const twilioClient = twilio(accountSid, authToken);


// Speak text response using Twilio
exports.say = async function say(callSid, text) {
  const twiml = new VoiceResponse();
  twiml.say(text);
  twiml.pause({length: 15});
  return await modifyCall(callSid, twiml);
}

// Play typing noise using Twilio
exports.play = async function play(callSid, url) {
  const twiml = new VoiceResponse();
  twiml.play(url);
  return await modifyCall(callSid, twiml);
}

  // Pause ongoing call using Twilio
  exports.pause = async function pause(callSid) {
  const twiml = new VoiceResponse();
  twiml.pause({length: 30});
  return await modifyCall(callSid, twiml);
}

async function modifyCall(callSid, twiml) {
  try {
    const call = await twilioClient.calls(callSid)
      .update({
        twiml: twiml.toString(),
        method: 'POST'
      });
    return call;
  } catch (error) {
    console.error(`Failed to modify call ${callSid}:`, error);
    throw error;
  }
}