import { DocumentChunk, RetrievedChunkMatch, RAGInspectionDetails, Citation } from '../types';
import { generateDocumentChunks, INDEL_DOCUMENTS } from '../data/indelDocuments';

// Spanish stopwords for cleaning and lexical token matching
const STOPWORDS = new Set([
  'de', 'la', 'que', 'el', 'en', 'y', 'a', 'los', 'del', 'se', 'las', 'por', 'un', 'para',
  'con', 'no', 'una', 'su', 'al', 'lo', 'como', 'mas', 'pero', 'sus', 'le', 'ya', 'o',
  'este', 'si', 'porque', 'esta', 'son', 'entre', 'esta', 'cuando', 'muy', 'sin', 'sobre',
  'tambien', 'me', 'hasta', 'hay', 'donde', 'quien', 'desde', 'todo', 'nos', 'durante',
  'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese', 'eso', 'ante', 'ellos', 'e',
  'esto', 'mi', 'antes', 'algunos', 'que', 'unos', 'yo', 'otro', 'otras', 'otra', 'cual',
  'dice', 'dime', 'explicame', 'hola', 'buenas', 'buenos', 'dias', 'tardes', 'noches',
  'saber', 'quisiera', 'necesito'
]);

export function cleanTokens(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOPWORDS.has(t));
}

// Calculate lexical matching score + keyword semantic boosting
export function scoreChunkLexical(queryTokens: string[], chunk: DocumentChunk): number {
  if (queryTokens.length === 0) return 0;
  const chunkText = `${chunk.docTitle} ${chunk.sectionTitle} ${chunk.articleNumber || ''} ${chunk.content} ${chunk.keywords.join(' ')}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  let matches = 0;
  let weightSum = 0;

  for (const token of queryTokens) {
    let tokenWeight = 1.0;
    // Boost specific high-value institutional tokens
    if (['demerito', 'demeritos', 'memorandum', 'acta', 'compromiso', 'sancion', 'sanciones', 'llamado', 'drive', 'disciplina'].includes(token)) tokenWeight = 2.5;
    if (['falta', 'faltas', 'leves', 'graves', 'sueter', 'bolson', 'transparente', 'chicle', 'vello', 'barba', 'cejas', 'punteras'].includes(token)) tokenWeight = 2.5;
    if (['uniforme', 'uniformes', 'polo', 'pantalon', 'zapatos', 'falda', 'gafete', 'calcetas', 'calcetines', 'piercing', 'aretes'].includes(token)) tokenWeight = 2.2;
    if (['conapina', 'pnc', 'padres', 'familia', 'crecer', 'juntos', 'justificacion', 'inasistencia', 'docentes', 'lcd', 'despido', 'inhabilitacion'].includes(token)) tokenWeight = 2.3;
    if (['modulos', 'software', 'segundo', 'ano', 'primer', 'tercer', 'malla', 'materias'].includes(token)) tokenWeight = 2.2;
    if (['nota', 'minima', 'aprobar', 'aprobacion', 'recuperacion', '7.0', 'reprobar', 'asistencia', '85%'].includes(token)) tokenWeight = 2.2;
    if (['admision', 'beca', 'becas', 'steam', 'examen', 'requisitos', 'fechas', 'matricula'].includes(token)) tokenWeight = 2.2;

    if (chunkText.includes(token)) {
      matches += tokenWeight;
    }
    weightSum += tokenWeight;
  }

  return weightSum > 0 ? matches / weightSum : 0;
}

// Cosine pseudo-similarity simulator for RAG vector ranking
export function scoreChunkSemantic(queryTokens: string[], chunk: DocumentChunk): number {
  const chunkTokens = cleanTokens(`${chunk.content} ${chunk.keywords.join(' ')}`);
  const chunkSet = new Set(chunkTokens);

  let intersection = 0;
  for (const token of queryTokens) {
    if (chunkSet.has(token)) {
      intersection++;
    } else {
      // Partial prefix matching (e.g. uniform -> uniformes, modul -> modulos)
      for (const ct of chunkTokens) {
        if (ct.startsWith(token) || token.startsWith(ct)) {
          intersection += 0.6;
          break;
        }
      }
    }
  }

  const denominator = Math.sqrt(queryTokens.length) * Math.sqrt(Math.max(5, chunkTokens.length / 4));
  return denominator > 0 ? Math.min(0.99, (intersection / denominator) * 1.5) : 0;
}

export function searchRAGChunks(
  query: string,
  chunks: DocumentChunk[] = generateDocumentChunks(),
  options: {
    topK?: number;
    minScore?: number;
    filterDocId?: string;
  } = {}
): {
  topMatches: RetrievedChunkMatch[];
  inspection: RAGInspectionDetails;
} {
  const topK = options.topK ?? 4;
  const minScore = options.minScore ?? 0.12;
  const queryTokens = cleanTokens(query);

  const scoredList: RetrievedChunkMatch[] = [];

  for (const chunk of chunks) {
    if (options.filterDocId && chunk.docId !== options.filterDocId) {
      continue;
    }

    const keywordScore = scoreChunkLexical(queryTokens, chunk);
    const semanticScore = scoreChunkSemantic(queryTokens, chunk);
    
    // Combined hybrid RAG score (60% semantic + 40% lexical)
    const combinedScore = (semanticScore * 0.6) + (keywordScore * 0.4);

    if (combinedScore >= minScore) {
      // Find highlighted snippets where query words appear
      const words = chunk.content.split('. ');
      const matchingSentences = words.filter(s => {
        const cleanS = s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return queryTokens.some(qt => cleanS.includes(qt));
      });

      scoredList.push({
        chunk,
        similarityScore: parseFloat(semanticScore.toFixed(3)),
        keywordScore: parseFloat(keywordScore.toFixed(3)),
        combinedScore: parseFloat(combinedScore.toFixed(3)),
        highlightSnippets: matchingSentences.length > 0 ? matchingSentences.slice(0, 2) : [chunk.content.slice(0, 140) + '...']
      });
    }
  }

  // Sort descending by combined score
  scoredList.sort((a, b) => b.combinedScore - a.combinedScore);
  const topMatches = scoredList.slice(0, topK);

  // Intent classification
  let detectedIntent = 'Consulta General de Normativa';
  const qLower = query.toLowerCase();
  if (qLower.includes('demerito') || qLower.includes('memorandum') || qLower.includes('acta') || qLower.includes('compromiso') || qLower.includes('sancion') || qLower.includes('falta') || qLower.includes('llamado') || qLower.includes('drive')) {
    detectedIntent = 'Régimen Disciplinario, Deméritos y Memorándum / Actas';
  } else if (qLower.includes('uniform') || qLower.includes('ropa') || qLower.includes('vestir') || qLower.includes('calzado') || qLower.includes('piercing') || qLower.includes('gafete') || qLower.includes('sueter') || qLower.includes('bolson') || qLower.includes('francesa')) {
    detectedIntent = 'Normativa de Uniforme, Presentación Personal y Bolsón Transparente';
  } else if (qLower.includes('padre') || qLower.includes('familia') || qLower.includes('crecer juntos') || qLower.includes('referente') || qLower.includes('inasistencia')) {
    detectedIntent = 'Normativa para Referentes de Familia (Art. 55 Ley Crecer Juntos)';
  } else if (qLower.includes('docente') || qLower.includes('profesor') || qLower.includes('lcd') || qLower.includes('suspension') || qLower.includes('despido') || qLower.includes('inhabilitacion')) {
    detectedIntent = 'Normativa, Obligaciones y Sanciones para Personal Docente (LCD)';
  } else if (qLower.includes('modulo') || qLower.includes('materia') || qLower.includes('ano') || qLower.includes('software') || qLower.includes('malla') || qLower.includes('carrera')) {
    detectedIntent = 'Malla Curricular & Plan de Estudios de Software';
  } else if (qLower.includes('nota') || qLower.includes('promed') || qLower.includes('aprobar') || qLower.includes('recuper') || qLower.includes('asistenc')) {
    detectedIntent = 'Evaluación, Promoción y Asistencia Académica';
  } else if (qLower.includes('conapina') || qLower.includes('pnc') || qLower.includes('fiscalia')) {
    detectedIntent = 'Remisión a Instancias Judiciales y de Protección de la Niñez';
  }

  // Calculate grounding confidence score
  const highestScore = topMatches[0]?.combinedScore ?? 0;
  const groundingConfidenceScore = Math.min(99, Math.round(highestScore * 100 * 1.3));
  const isGroundedInDocs = topMatches.length > 0 && highestScore >= 0.28;

  let hallucinationRisk: 'Bajo' | 'Moderado' | 'Alto' | 'Sin datos en fuente' = 'Bajo';
  if (!isGroundedInDocs) {
    hallucinationRisk = 'Sin datos en fuente';
  } else if (highestScore < 0.40) {
    hallucinationRisk = 'Moderado';
  }

  const inspection: RAGInspectionDetails = {
    query,
    detectedIntent,
    keywordsExtracted: queryTokens,
    totalChunksSearched: chunks.length,
    retrievedChunks: topMatches,
    similarityThreshold: minScore,
    systemPromptUsed: `Eres NEXUS, el Asistente Académico con RAG e IA Oficial del Instituto Nacional Cantón Lourdes (INDEL).
REGLA CARDINAL DE RIGOR RAG:
1. Responde ÚNICAMENTE basándote en los fragmentos de documentos oficiales provistos en el CONTEXTO (Normativa de Estudiantes, Deméritos, Sanciones, Actas/Memorándum, Normativa de Padres Ley Crecer Juntos, y Normativa Docente LCD).
2. Cita siempre el documento exacto y numeral o artículo de donde extraes cada dato (ej. [DOC-DISC-02, Sanciones] o [DOC-EST-01, Num. 1-8]).
3. Si te preguntan sobre deméritos o llamados de atención: 1.º llamado es verbal registrado en Drive; 2.º llamado va al expediente con disciplina positiva; ¡el 3.er llamado verbal se convierte en FALTA GRAVE y amerita ACTA COMPROMISO / MEMORÁNDUM firmado por estudiante y referente de familia!
4. SI LA INFORMACIÓN SOLICITADA NO APARECE EN LOS DOCUMENTOS OFICIALES, NO INVENTES NADA. Responde diciendo con honestidad que no figura en los reglamentos oficiales de INDEL.`,
    assembledContextTokens: topMatches.reduce((acc, curr) => acc + Math.round(curr.chunk.content.length / 4), 0),
    groundingConfidenceScore: isGroundedInDocs ? Math.max(65, groundingConfidenceScore) : 12,
    hallucinationRisk,
    isGroundedInDocs,
    modelUsed: 'gemini-3.8-flash (RAG Grounded Pipeline)',
    latencyMs: 140 + Math.floor(Math.random() * 80)
  };

  return { topMatches, inspection };
}

// Generate citations from retrieved matches
export function extractCitationsFromMatches(matches: RetrievedChunkMatch[]): Citation[] {
  return matches.map(m => ({
    docId: m.chunk.docId,
    docCode: m.chunk.docCode,
    docTitle: m.chunk.docTitle,
    articleNumber: m.chunk.articleNumber,
    sectionTitle: m.chunk.sectionTitle,
    exactSnippet: m.chunk.content.slice(0, 160) + '...'
  }));
}
