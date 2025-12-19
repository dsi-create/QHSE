// Configuration des types de documents selon la procédure QGR-PROC-001
export const DOCUMENT_TYPES = {
  POL: { code: 'POL', label: 'Politique', description: 'Document stratégique définissant les orientations et engagements de la direction' },
  PROC: { code: 'PROC', label: 'Procédure', description: 'Document décrivant de manière séquentielle les actions à mener pour réaliser une activité' },
  PROT: { code: 'PROT', label: 'Protocole', description: 'Mode opératoire standardisé détaillant des actes techniques spécifiques' },
  FP: { code: 'FP', label: 'Fiche de poste', description: 'Document définissant les missions, responsabilités et compétences d\'un poste' },
  FT: { code: 'FT', label: 'Fiche technique', description: 'Document décrivant les caractéristiques et conditions d\'utilisation d\'un équipement' },
  FORM: { code: 'FORM', label: 'Formulaire', description: 'Support structuré pour recueillir ou restituer des informations standardisées' },
  ANN: { code: 'ANN', label: 'Annexe', description: 'Document complémentaire rattaché à un document principal' },
  // Types additionnels pour compatibilité
  instruction: { code: 'INST', label: 'Instruction', description: 'Instruction opérationnelle' },
  registre: { code: 'REG', label: 'Registre', description: 'Registre de suivi' },
  rapport: { code: 'RAP', label: 'Rapport', description: 'Rapport d\'activité ou d\'analyse' },
  audit: { code: 'AUD', label: 'Audit', description: 'Rapport d\'audit' },
  formation: { code: 'FOR', label: 'Formation', description: 'Document de formation' },
} as const;

// Configuration des processus/thématiques selon la procédure QGR-PROC-001
export const PROCESSUS_CODES = {
  // Gouvernance
  GOUV: { code: 'GOUV', label: 'Gouvernance', category: 'Gouvernance', description: 'Management stratégique' },
  
  // Qualité et gestion des risques
  QGR: { code: 'QGR', label: 'Qualité et gestion des risques', category: 'Qualité', description: 'Qualité et gestion des risques' },
  
  // Parcours patient médical
  MED: { code: 'MED', label: 'Hospitalisation médicale', category: 'Parcours patient médical', description: 'Hospitalisation médicale' },
  CHIR: { code: 'CHIR', label: 'Hospitalisation chirurgicale', category: 'Parcours patient médical', description: 'Hospitalisation chirurgicale' },
  BOP: { code: 'BOP', label: 'Bloc opératoire', category: 'Parcours patient médical', description: 'Bloc opératoire' },
  CON: { code: 'CON', label: 'Consultation', category: 'Parcours patient médical', description: 'Consultation' },
  EXP: { code: 'EXP', label: 'Explorations fonctionnelles', category: 'Parcours patient médical', description: 'Explorations fonctionnelles' },
  LAB: { code: 'LAB', label: 'Laboratoire', category: 'Parcours patient médical', description: 'Laboratoire' },
  IMA: { code: 'IMA', label: 'Imagerie médicale', category: 'Parcours patient médical', description: 'Imagerie médicale' },
  ENDO: { code: 'ENDO', label: 'Endoscopie', category: 'Parcours patient médical', description: 'Endoscopie' },
  MAT: { code: 'MAT', label: 'Salle de naissance', category: 'Parcours patient médical', description: 'Salle de naissance' },
  URG: { code: 'URG', label: 'Urgences', category: 'Parcours patient médical', description: 'Urgences' },
  REA: { code: 'REA', label: 'Réanimation', category: 'Parcours patient médical', description: 'Réanimation' },
  
  // Parcours patient administratif
  PPH: { code: 'PPH', label: 'Parcours administratif en hospitalisation', category: 'Parcours patient administratif', description: 'Parcours administratif en hospitalisation' },
  PPE: { code: 'PPE', label: 'Parcours administratif en externe', category: 'Parcours patient administratif', description: 'Parcours administratif en externe' },
  
  // Transverses
  GRI: { code: 'GRI', label: 'Risque infectieux', category: 'Transverses', description: 'Risque infectieux' },
  MEDI: { code: 'MEDI', label: 'Médicaments', category: 'Transverses', description: 'Médicaments' },
  DP: { code: 'DP', label: 'Dossier du patient', category: 'Transverses', description: 'Dossier du patient' },
  DDP: { code: 'DDP', label: 'Droits du patient', category: 'Transverses', description: 'Droits du patient' },
  DOU: { code: 'DOU', label: 'Douleur', category: 'Transverses', description: 'Douleur' },
  FV: { code: 'FV', label: 'Fin de vie', category: 'Transverses', description: 'Fin de vie' },
  IV: { code: 'IV', label: 'Identification du patient', category: 'Transverses', description: 'Identification du patient' },
  TRA: { code: 'TRA', label: 'Transport des patients', category: 'Transverses', description: 'Transport des patients' },
  
  // Supports
  RH: { code: 'RH', label: 'Ressources Humaines', category: 'Supports', description: 'Ressources Humaines' },
  ACH: { code: 'ACH', label: 'Achats et stocks', category: 'Supports', description: 'Achats et stocks' },
  FIN: { code: 'FIN', label: 'Finances', category: 'Supports', description: 'Finances' },
  SI: { code: 'SI', label: 'Systèmes d\'information', category: 'Supports', description: 'Systèmes d\'information' },
  MAIN: { code: 'MAIN', label: 'Maintenance', category: 'Supports', description: 'Maintenance' },
  HYG: { code: 'HYG', label: 'Hygiène', category: 'Supports', description: 'Hygiène' },
  REST: { code: 'REST', label: 'Restauration', category: 'Supports', description: 'Restauration' },
  LING: { code: 'LING', label: 'Lingerie', category: 'Supports', description: 'Lingerie' },
  ENV: { code: 'ENV', label: 'Environnement', category: 'Supports', description: 'Environnement' },
  SEC: { code: 'SEC', label: 'Sécurité et plan d\'urgence', category: 'Supports', description: 'Sécurité et plan d\'urgence' },
  MCC: { code: 'MCC', label: 'Marketing, commercial et communication', category: 'Supports', description: 'Marketing, commercial et communication' },
  
  // Comités et instances
  INST: { code: 'INST', label: 'Comités et instances', category: 'Gouvernance institutionnelle', description: 'Comités et instances' },
} as const;

// Fonction pour générer le code document selon le format XXXX-XXXX-001
export function generateDocumentCode(processusCode: string, documentTypeCode: string, existingCodes: string[]): string {
  const prefix = `${processusCode}-${documentTypeCode}-`;
  
  // Trouver le prochain numéro disponible
  let nextNumber = 1;
  const existingNumbers = existingCodes
    .filter(code => code.startsWith(prefix))
    .map(code => {
      const match = code.match(/-(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => num > 0);
  
  if (existingNumbers.length > 0) {
    nextNumber = Math.max(...existingNumbers) + 1;
  }
  
  // Formater le numéro avec des zéros devant (001, 002, etc.)
  const formattedNumber = nextNumber.toString().padStart(3, '0');
  
  return `${prefix}${formattedNumber}`;
}

// Grouper les processus par catégorie pour l'affichage
export const PROCESSUS_BY_CATEGORY = Object.values(PROCESSUS_CODES).reduce((acc, processus) => {
  if (!acc[processus.category]) {
    acc[processus.category] = [];
  }
  acc[processus.category].push(processus);
  return acc;
}, {} as Record<string, typeof PROCESSUS_CODES[keyof typeof PROCESSUS_CODES][]>);



