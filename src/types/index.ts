export interface DocumentArticle {
  id: string;
  articleNumber?: string;
  title: string;
  content: string;
  keywords: string[];
}

export interface OfficialDocument {
  id: string;
  code: string;
  title: string;
  category: 'reglamento' | 'academico' | 'evaluacion' | 'admision' | 'seguridad' | 'institucional';
  badgeColor: string;
  effectiveDate: string;
  version: string;
  authority: string;
  description: string;
  sections: {
    title: string;
    articles: DocumentArticle[];
  }[];
  rawContent?: string;
}

export interface DocumentChunk {
  id: string;
  docId: string;
  docCode: string;
  docTitle: string;
  sectionTitle: string;
  articleNumber?: string;
  content: string;
  vectorCoords: { x: number; y: number; z?: number };
  keywords: string[];
}

export interface RetrievedChunkMatch {
  chunk: DocumentChunk;
  similarityScore: number;
  keywordScore: number;
  combinedScore: number;
  highlightSnippets: string[];
}

export interface RAGInspectionDetails {
  query: string;
  detectedIntent: string;
  keywordsExtracted: string[];
  totalChunksSearched: number;
  retrievedChunks: RetrievedChunkMatch[];
  similarityThreshold: number;
  systemPromptUsed: string;
  assembledContextTokens: number;
  groundingConfidenceScore: number; // e.g. 0 to 100%
  hallucinationRisk: 'Bajo' | 'Moderado' | 'Alto' | 'Sin datos en fuente';
  isGroundedInDocs: boolean;
  modelUsed: string;
  latencyMs: number;
}

export interface Citation {
  docId: string;
  docCode: string;
  docTitle: string;
  articleNumber?: string;
  sectionTitle: string;
  exactSnippet: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'nexus';
  text: string;
  timestamp: string;
  ragDetails?: RAGInspectionDetails;
  citations?: Citation[];
  audioBase64?: string;
  isAudioLoading?: boolean;
  notInDocsWarning?: boolean;
}

export type ThemeColor = 'emerald' | 'amber' | 'violet' | 'crimson';
