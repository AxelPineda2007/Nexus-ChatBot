import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { INDEL_DOCUMENTS, generateDocumentChunks } from './src/data/indelDocuments';
import { searchRAGChunks, extractCitationsFromMatches } from './src/lib/ragEngine';
import { OfficialDocument, DocumentChunk } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory document storage initialized with INDEL official documents
let currentDocuments: OfficialDocument[] = [...INDEL_DOCUMENTS];
let currentChunks: DocumentChunk[] = generateDocumentChunks(currentDocuments);

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route: List all official documents
  app.get('/api/documents', (req, res) => {
    res.json({
      documents: currentDocuments,
      totalChunks: currentChunks.length,
      institution: 'Instituto Nacional Cantón Lourdes (INDEL)',
      address: '6.ª Avenida Sur Colonia Las Arboledas, Lourdes Colón',
      phone: '2338-4571',
      email: 'indel_11028@hotmail.com'
    });
  });

  // API Route: Ingest a custom document into live RAG memory
  app.post('/api/index-document', (req, res) => {
    try {
      const { title, code, category, authority, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: 'Título y contenido son requeridos.' });
      }

      const newDocId = `doc-custom-${Date.now()}`;
      const docCode = code || `DOC-USER-${Math.floor(100 + Math.random() * 900)}`;

      // Split content into basic sections or paragraphs
      const paragraphs = content.split('\n\n').filter((p: string) => p.trim().length > 0);
      const articles = paragraphs.map((p: string, idx: number) => ({
        id: `custom-art-${idx + 1}`,
        articleNumber: `Sec. ${idx + 1}`,
        title: `Párrafo ${idx + 1}`,
        content: p.trim(),
        keywords: [title.toLowerCase(), 'custom', docCode.toLowerCase()]
      }));

      const newDoc: OfficialDocument = {
        id: newDocId,
        code: docCode,
        title: title.trim(),
        category: category || 'institucional',
        badgeColor: 'purple',
        effectiveDate: 'Ingreso Inmediato RAG',
        version: 'v1.0 (Sandbox Ingestion)',
        authority: authority || 'Administración / Docencia INDEL',
        description: `Documento incorporado en tiempo real al repositorio RAG: ${title}`,
        sections: [
          {
            title: 'Contenido Indexado',
            articles
          }
        ]
      };

      currentDocuments = [newDoc, ...currentDocuments];
      currentChunks = generateDocumentChunks(currentDocuments);

      res.json({
        success: true,
        document: newDoc,
        totalDocuments: currentDocuments.length,
        totalChunks: currentChunks.length
      });
    } catch (err: any) {
      console.error('Error indexing document:', err);
      res.status(500).json({ error: err.message || 'Error al indexar documento' });
    }
  });

  // API Route: Query NEXUS with RAG pipeline and Gemini 3.8 Flash
  app.post('/api/query', async (req, res) => {
    const startTime = Date.now();
    try {
      const { question, strictMode = true, filterDocId } = req.body;

      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: 'Pregunta requerida' });
      }

      // Step 1: Retrieval through RAG engine
      const { topMatches, inspection } = searchRAGChunks(question, currentChunks, {
        topK: 4,
        minScore: 0.12,
        filterDocId,
      });

      const citations = extractCitationsFromMatches(topMatches);
      const latencyMs = Date.now() - startTime;
      inspection.latencyMs = latencyMs;

      // Anti-hallucination guardrail check:
      // If no chunks matched or relevance is too low, NEXUS explicitly states it's not in the official docs
      if (!inspection.isGroundedInDocs) {
        return res.json({
          answer: `Lo siento, no he encontrado información sobre esa consulta en los **documentos oficiales y reglamentos vigentes del INDEL**.\n\nComo asistente académico con arquitectura **RAG (Retrieval-Augmented Generation) estricta**, tengo la instrucción de **no inventar información no verificable**. Si consideras que se trata de un tema institucional no cubierto en el repositorio digital actual, te sugiero consultar directamente en **Secretaría Académica** o con la **Coordinación de Tecnologías de la Información**.`,
          citations: [],
          ragDetails: inspection,
          notInDocsWarning: true,
        });
      }

      // Prepare context for Gemini 3.8 Flash
      const contextBlocks = topMatches.map((match, idx) => {
        return `[FRAGMENTO OFICIAL #${idx + 1}]
DOCUMENTO: ${match.chunk.docTitle} (${match.chunk.docCode})
SECCIÓN / ARTÍCULO: ${match.chunk.sectionTitle} - ${match.chunk.articleNumber || ''}
CONTENIDO OFICIAL:
${match.chunk.content}
SIMILARIDAD SEMÁNTICA: ${(match.similarityScore * 100).toFixed(1)}%`;
      }).join('\n\n------------------\n\n');

      const systemInstruction = `Eres NEXUS, el Asistente Académico Inteligente Oficial del Instituto Nacional Cantón Lourdes (INDEL), ubicado en 6.ª Av. Sur Col. Las Arboledas, Lourdes Colón.
Tu arquitectura es RAG (Retrieval-Augmented Generation): respondes ÚNICAMENTE basándote en los documentos oficiales institucionales suministrados en el CONTEXTO.

CONOCIMIENTO OFICIAL INDEL:
- Normativa Estudiantil: 31 deberes u obligaciones (ingreso 15 min antes, uniforme diario sin modificar, calcetas blancas señoritas / calcetines negros varones SIN PUNTERAS, cincho negro de cuero, monograma cosido bolsa izquierda, corte francesa oscura sin cortes de moda, sin vello facial/barba/bigote, aretes pequeños señoritas / no permitidos caballeros, uñas sin color ni acrílicas, sin maquillaje ni tinte, prohibido celular y audífonos en clases/recesos/horas libres, prohibido chicle, sin cadenas/piercing, gabacha limpia en bolsón para taller, portar laptop/usb/cargador, bolsón y estuche TRANSPARENTE NO DE COLOR).
- Clasificación de Faltas y Deméritos:
  • 27 Faltas Leves (suéter oscuro/sudaderas, portar suéter después de las 8:30 am, cejas con corte/tatuadas, aritos grandes, cintas XL en tenis, gabacha en hora incorrecta, alimentos en horas de almuerzo no traídos por padres, bebidas carbonatadas/energizantes/jugos, vello facial, etc.).
  • Faltas Graves (vocabulario soez, gritos/escándalo en cafetería/pasillos/fotocopiadora, escenas amorosas dentro y fuera).
  • Faltas Muy Graves (bromas bruscas, cutter/navajas/cortopunzantes, drogas/alcohol/cigarros a PNC, bullying a PNC, hurto/robo, acoso/abuso sexual, riñas, daño mobiliario/sanitarios).
- Sanciones y Deméritos:
  1.º llamado verbal se registra en Drive.
  2.º llamado se registra en el expediente con acciones de disciplina positiva.
  ¡EL 3.ER LLAMADO VERBAL SE CONVIERTE EN FALTA GRAVE y se elabora ACTA COMPROMISO / MEMORÁNDUM firmada por estudiante y referente de familia!
  Reincidencia grave: suspensión de clases presenciales con proceso académico multimodal.
  Faltas muy graves: matrícula condicionada y aviso a CONAPINA, PNC, Fiscalía, ISDEMU.
- Referentes de Familia: Ley Crecer Juntos Art. 55, justificaciones de inasistencia por link el mismo día, y por escrito de más de un día solo por duelo/médico/clubes/becas; vestimenta decorosa al entrar (prohibido short, minifalda, licras, top); teléfono 23384571.
- Personal Docente: LCD Arts. 31, 32, 53-64 (amonestación escrita, suspensión de 3 a 30 días o 30 a 60 días sin goce de sueldo, despido e inhabilitación).

REGLAS ESTRICTAS DE RESPUESTA:
1. BREVEDAD Y ESPECIFICIDAD OBLIGATORIA: Sé conciso, directo y ve al grano inmediatamente. No uses párrafos largos, disculpas introductorias ni saludos repetitivos.
2. Formato: Responde con 2 a 4 oraciones directas o viñetas cortas y exactas. Si la pregunta es cerrada (ej. ¿se permite X?), inicia con una afirmación directa («No está permitido...» o «Sí, según la norma...»).
3. Cada afirmación clave DEBE citar su fuente oficial indicando el código y artículo o numeral (ej. [DOC-DISC-02, Sanciones] o [DOC-EST-01, Num. 1-8]).
4. NUNCA inventes información. Si no está en los fragmentos, di brevemente que no figura en la normativa del INDEL.`;

      const userPrompt = `CONTEXTO OFICIAL PROVISTO POR EL SISTEMA RAG DEL INDEL:
"""
${contextBlocks}
"""

PREGUNTA DEL ESTUDIANTE / VISITANTE:
"${question}"

Instrucción de formato: Redacta una respuesta BREVE, ESPECÍFICA y DIRECTA AL GRANO (máximo 3 o 4 líneas o viñetas concisas), citando las fuentes oficiales exactas entre corchetes.`;

      let generatedAnswer = '';

      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: userPrompt,
            config: {
              systemInstruction,
              temperature: 0.15, // Low temperature for high fidelity to official documentation
            },
          });
          generatedAnswer = response.text || '';
        } catch (genError: any) {
          console.error('Gemini API call failed, generating fallback response:', genError);
          // High quality deterministic fallback matching official snippets if offline or quota exceeded
          generatedAnswer = fallbackFormatAnswer(question, topMatches);
        }
      } else {
        generatedAnswer = fallbackFormatAnswer(question, topMatches);
      }

      res.json({
        answer: generatedAnswer,
        citations,
        ragDetails: {
          ...inspection,
          latencyMs: Date.now() - startTime,
        },
        notInDocsWarning: false,
      });
    } catch (err: any) {
      console.error('Error handling query:', err);
      res.status(500).json({ error: err.message || 'Error al procesar consulta' });
    }
  });

  // API Route: Text-To-Speech with gemini-3.8-flash-lite-tts
  app.post('/api/tts', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Texto requerido' });
      }

      // Clean markdown symbols for cleaner TTS pronunciation
      const cleanText = text
        .replace(/\[DOC-[^\]]+\]/g, '') // remove citation tags from speech
        .replace(/[*_#`•]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 480); // First 480 chars for snappy latency

      if (!ai) {
        return res.json({ available: false, message: 'Gemini TTS not initialized' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: cleanText,
                speechMetadata: {
                  style: 'Voz clara, fluida, profesional y académica en español latinoamericano.',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (base64Audio) {
        res.json({
          available: true,
          audioBase64: base64Audio,
          format: 'audio/wav',
        });
      } else {
        res.json({ available: false, message: 'No audio generated' });
      }
    } catch (err: any) {
      console.error('Error in TTS route:', err);
      res.status(500).json({ available: false, error: err.message });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'operational',
      model: 'gemini-3.8-flash',
      ragChunksCount: currentChunks.length,
      hasGeminiApiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // In development, hook up Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NEXUS RAG Server listening on port ${PORT}`);
  });
}

// Structured fallback formatting based on official chunk content
function fallbackFormatAnswer(query: string, matches: any[]): string {
  if (matches.length === 0) {
    return 'No se encontró información en la base documental del INDEL.';
  }

  const primaryMatch = matches[0];
  let summary = `**Respuesta oficial [${primaryMatch.chunk.docCode}]:**\n\n`;

  const topTwo = matches.slice(0, 2);
  topTwo.forEach((m) => {
    const briefContent = m.chunk.content.split('\n')[0] || m.chunk.content.slice(0, 200);
    summary += `• **${m.chunk.articleNumber || m.chunk.sectionTitle}**: ${briefContent}\n*Fuente: [${m.chunk.docCode}, ${m.chunk.articleNumber || m.chunk.sectionTitle}]*\n\n`;
  });

  return summary.trim();
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
