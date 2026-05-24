const { GoogleGenerativeAI } = require('@google/generative-ai');
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
(async () => {
  try {
    const models = await ai.getModels();
    console.log(models);
  } catch (err) {
    console.log(err.message);
  }
})();
