// src/api/geminiService.js

// 1. CONSTANTS
const MODEL_NAME = "gemini-2.5-flash"; // Best balance of speed and free-tier access
const API_KEY = "AIzaSyBf4F0cZnjWbfV8V3Oiv-jyGwFsyNAd8eA"; 

/**
 * Generates a compelling product description for agricultural products.
 * * @param {string} productName - E.g., "Organic Alphonso Mangoes"
 * @param {string} productDetails - E.g., "Grown in Ratnagiri, chemical-free, sweet taste"
 * @returns {Promise<string>} - The generated description.
 */
export async function generateDescription(productName, productDetails) {
  
  // 2. CONSTRUCT THE PROMPT
  // We give the AI a "persona" to help farmers sell better.
  const systemInstruction = `
    You are an expert copywriter for 'Green Basket', an online marketplace for farmers.
    Your goal is to write attractive, trustworthy, and clear product descriptions that help farmers sell their produce.
    
    Guidelines:
    - Tone: Fresh, organic, trustworthy, and appetizing.
    - Structure: Start with a catchy hook, list key benefits (health/taste), and end with a call to action.
    - formatting: Use bullet points for features.
    - Keep it under 150 words.
  `;

  const userPrompt = `Write a description for this product:
  Product: ${productName}
  Details: ${productDetails}`;

  // 3. API URL (Constructed dynamically to be safe)
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

  const payload = {
    contents: [{
      parts: [{ text: userPrompt }]
    }],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return generatedText || "Could not generate description.";

  } catch (error) {
    console.error("Gemini API Request Failed:", error);
    return "Error: Unable to generate description at this time. Please try again later.";
  }
}