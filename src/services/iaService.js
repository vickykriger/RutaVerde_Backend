import { iaClient } from '../config/iaConfig.js';

export const mejorarNoticiaService = async (titulo, descripcion) => {
  const prompt = `
Eres un editor periodístico profesional especializado en noticias medioambientales y ecológicas para el portal "Ruta Verde".
Tu tarea es tomar el título y contenido borrador de una noticia y reescribirlos para que sean más atractivos, claros, profesionales y bien redactados en español.

Borrador original:
- Título: "${titulo}"
- Contenido: "${descripcion}"

Responde ÚNICAMENTE con un objeto JSON válido con la siguiente estructura exacta:
{
  "titulo": "Título mejorado y atrapante",
  "descripcion": "Contenido reescrito, fluido, bien redactado y profesional"
}
`;

  try {
    const response = await iaClient.chat.completions.create({
      model: 'gpt-4o-mini', // Cambiá por el modelo de tu proveedor (ej: 'deepseek-chat', 'llama-3.1-70b-versatile', etc.)
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
    });

    let rawText = response.choices[0].message.content.trim();

    if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
    }

    const result = JSON.parse(rawText);
    return result;
  } catch (error) {
    console.error('Detalle del error en la IA:', error);
    throw new Error(`Error al procesar con IA: ${error.message}`);
  }
};