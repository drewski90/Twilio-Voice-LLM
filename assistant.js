const axios = require('axios');
const openaiApiKey = process.env.OPENAI_API_KEY;

const defaultSystemPrompt = `
You are an AI language model. Your task is to provide brief, concise, and helpful responses. 
Only elaborate if explicitly requested by the user.
`; 

module.exports = class Assistant {

  constructor(options={}) {
    this.options = options;
    this.messages = [];
    this.systemPrompt = defaultSystemPrompt;
  }

  async chatCompletion(prompt) {
    // add user
    this.messages.push({ role: 'user', content: prompt });

    const messages = this.messages;

    if (this.systemPrompt) {
      // add system prompt if it exists
      messages = [{role: "system", content: this.systemPrompt}, ...messages]
    }

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o',
        messages: messages,
        ...this.options
      }, {
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });
  
      const content = response.data.choices[0].message.content.trim();

      this.messages.push({ role: "assistant", content })

      return content;
    } catch (error) {
      console.error('Error getting OpenAI chat completion:', error);
      throw error;
    }
  }

  destroy() {
    delete this.systemPrompt;
    delete this.messages;
    delete this.options;
  }

}