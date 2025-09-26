// api/ask.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(request, response) {
  // Solo permite peticiones POST por seguridad
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Verifica que se haya enviado una pregunta (prompt) en el cuerpo de la petición
  const { prompt } = request.body;
  if (!prompt) {
    return response.status(400).json({ message: 'Missing prompt' });
  }

  try {
    // Inicializa el cliente de la API usando la variable de entorno segura
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Envía la pregunta al modelo de Gemini
    const result = await model.generateContent(prompt);
    const apiResponse = await result.response;
    const text = apiResponse.text();

    // Devuelve la respuesta a tu sitio web como JSON
    response.status(200).json({ answer: text });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
}
