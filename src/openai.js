const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(config);

export async function sendMsgToOpenAI(message) {
  // const prompt = "tell me a joke about a cat eating pasta.";
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: message,
    max_tokens: 2048,
    temperature: 1,
  });
  return response.data.choices[0].text;
}

// const runPrompt = async () => {
//   const prompt = "tell me a joke about a cat eating pasta.";
//   const response = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: prompt,
//     max_tokens: 2048,
//     temperature: 1,
//   });
//   console.log(response.data.choices[0].text);
// };
// runPrompt();
