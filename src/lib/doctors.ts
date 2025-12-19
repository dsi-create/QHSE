import { Doctor } from '@/types';

export const doctors: Doctor[] = [
  // MÉDECINS GÉNÉRALISTES RÉSIDENTS
  { id: 'doc-1', name: 'MOUNGA MBASSI Merveille', specialty: 'Médecin Généraliste', status: 'Résident', created_at: new Date() },
  { id: 'doc-2', name: 'MANSIR ELLA Michele', specialty: 'Médecin Généraliste', status: 'Résident', created_at: new Date() },
  { id: 'doc-3', name: 'MAZAMBA Loic Thystère', specialty: 'Médecin Généraliste', status: 'Résident', created_at: new Date() },
  { id: 'doc-4', name: 'SALOM RODRIGUEZ Yanet', specialty: 'Médecin Généraliste', status: 'Résident', created_at: new Date() },
  { id: 'doc-5', name: 'ONDOUA Fernandez', specialty: 'Médecin Généraliste', status: 'Résident', created_at: new Date() },
  { id: 'doc-6', name: 'MOUNIEVI KOUANGA Negg', specialty: 'Médecin Généraliste', status: 'Résident', created_at: new Date() },
  { id: 'doc-7', name: 'OBAME ASSOUMOU Victor Cédric', specialty: 'Médecin Généraliste', status: 'Résident', created_at: new Date() },
  // MÉDECINS GÉNÉRALISTES DE GARDE
  { id: 'doc-8', name: 'KAMDEU Audrey Emilie', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  { id: 'doc-9', name: 'BIKANGA Bev', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  { id: 'doc-10', name: 'SOUOP Régis', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  { id: 'doc-11', name: 'KOULSOUM Mohamadou', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  { id: 'doc-12', name: 'ANGA KABA KITABA', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  { id: 'doc-13', name: 'MANFOUMBI Abi-Lenz', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  { id: 'doc-14', name: 'MBOULA Pauline', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  { id: 'doc-15', name: 'NGAWOMA Lozi Gaelle', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  { id: 'doc-16', name: 'NTSAME ANOUZOGO ABIAGA Elodie', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  { id: 'doc-17', name: 'NGUIAKAM Princesse', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  { id: 'doc-18', name: 'NGUIA NGUIA Camille', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  { id: 'doc-19', name: 'ONGOUTA MAFIA Grâce Chérille', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  { id: 'doc-20', name: 'PAMO LATELA Ornella Maeva', specialty: 'Médecin Généraliste', status: 'Garde', created_at: new Date() },
  // PÉDIATRES
  { id: 'doc-21', name: 'RAMAROJAONA Serge', specialty: 'Pédiatre', status: 'Résident', created_at: new Date() },
  { id: 'doc-22', name: 'MOUSSA Ousmane', specialty: 'Pédiatre', status: 'Résident', created_at: new Date() },
  { id: 'doc-23', name: 'ALOLI Nathalie Pauline', specialty: 'Pédiatre', status: 'Résident', created_at: new Date() },
  { id: 'doc-24', name: 'LOUMOUAMOU Yéni', specialty: 'Pédiatre', status: 'Résident', created_at: new Date() },
  { id: 'doc-25', name: 'NGOGHE Valérie', specialty: 'Pédiatre', status: 'Résident', created_at: new Date() },
  // ANESTHÉSISTES-RÉANIMATEURS
  { id: 'doc-26', name: 'AKEWA Maruis', specialty: 'Anesthésiste-Réanimateur', status: 'Résident', created_at: new Date() },
  { id: 'doc-27', name: 'SANMA Farid', specialty: 'Anesthésiste-Réanimateur', status: 'Résident', created_at: new Date() },
  // GASTRO-ENTÉROLOGUES
  { id: 'doc-28', name: 'Pr ITOUDI BIGNOUMBA Emery', specialty: 'Gastro-Entérologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-29', name: 'DJIEUKAM TOKO Danielle', specialty: 'Gastro-Entérologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-30', name: 'NGOMA SOUAMY Marielle', specialty: 'Gastro-Entérologue', status: 'Résident', created_at: new Date() },
  // CARDIOLOGUES
  { id: 'doc-31', name: 'Pr HOUENASSI Martin', specialty: 'Cardiologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-32', name: 'BABONGUI Latifa', specialty: 'Cardiologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-33', name: 'YEKINI Carole', specialty: 'Cardiologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-34', name: 'MELO TECHE Ghislaine', specialty: 'Cardiologue', status: 'Résident', created_at: new Date() },
  // GYNÉCOLOGUES-OBSTÉTRICIENS
  { id: 'doc-35', name: 'MAIGA Fatoumata', specialty: 'Gynécologue-Obstétricien', status: 'Résident', created_at: new Date() },
  { id: 'doc-36', name: 'CHITOU EPSE SANMA Bilkis', specialty: 'Gynécologue-Obstétricien', status: 'Résident', created_at: new Date() },
  { id: 'doc-37', name: 'SANON Adama', specialty: 'Gynécologue-Obstétricien', status: 'Vacataire', created_at: new Date() },
  { id: 'doc-38', name: 'SONON Aurele', specialty: 'Gynécologue-Obstétricien', status: 'Résident', created_at: new Date() },
  // UROLOGUES
  { id: 'doc-39', name: 'Pr NDANG NGOU Stevy', specialty: 'Urologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-40', name: 'LEMBANGOYE Paul', specialty: 'Urologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-41', name: 'IBABA Josaphat', specialty: 'Urologue', status: 'Interne', created_at: new Date() },
  // RADIOLOGUES
  { id: 'doc-44', name: 'BOLO Gaëtan', specialty: 'Radiologue', status: 'Vacataire', created_at: new Date() },
  // NEUROLOGUES
  { id: 'doc-45', name: 'NDAO ETENO Mael', specialty: 'Neurologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-46', name: 'SAPHOU DAMON Michel', specialty: 'Neurologue', status: 'Résident', created_at: new Date() },
  // OPHTALMOLOGUES
  { id: 'doc-47', name: 'MEKYNA EPSE MAPANGOU Cinthya', specialty: 'Ophtalmologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-48', name: 'APEDO Wilfried', specialty: 'Ophtalmologue', status: 'Vacataire', created_at: new Date() },
  // RHUMATOLOGUES
  { id: 'doc-49', name: 'EFEMBA Diane Kristel', specialty: 'Rhumatologue', status: 'Résident', created_at: new Date() },
  // DENTISTES
  { id: 'doc-50', name: 'GERMANY NEE ABBOUD Muriel', specialty: 'Dentiste', status: 'Résident', created_at: new Date() },
  { id: 'doc-51', name: 'MBOUMBA OVENGA Sergine', specialty: 'Dentiste', status: 'Résident', created_at: new Date() },
  // ENDOCRINOLOGUES
  { id: 'doc-52', name: 'ZIZA NGAILA Nesta Patricia', specialty: 'Endocrinologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-53', name: 'ANGUEZOMO Glwadis', specialty: 'Endocrinologue', status: 'Résident', created_at: new Date() },
  // DERMATOLOGUES
  { id: 'doc-54', name: 'BELLA SAFIOU Nouratou', specialty: 'Dermatologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-55', name: 'SADIBI Liz Carmen', specialty: 'Dermatologue', status: 'Résident', created_at: new Date() },
  // PNEUMOLOGUES
  { id: 'doc-56', name: 'IBINGA Linda', specialty: 'Pneumologue', status: 'Résident', created_at: new Date() },
  // NÉPHROLOGUES
  { id: 'doc-57', name: 'AKAGHAH ADEMBA Angélique', specialty: 'Néphrologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-58', name: 'SAFOU DAMON Michel-Arnaud', specialty: 'Néphrologue', status: 'Résident', created_at: new Date() },
  { id: 'doc-59', name: 'NDAO ETENO Mael', specialty: 'Néphrologue', status: 'Résident', created_at: new Date() },
  // ORL
  { id: 'doc-60', name: 'MANFOUMBI NGOMA Brice Albert', specialty: 'ORL', status: 'Résident', created_at: new Date() },
  { id: 'doc-61', name: 'NZAMBA Christelle', specialty: 'ORL', status: 'Résident', created_at: new Date() },
  // CHIRURGIENS
  { id: 'doc-62', name: 'Pr OWONO BOUENGOU Placide', specialty: 'Chirurgien Viscéral', status: 'Résident', created_at: new Date() },
  { id: 'doc-63', name: 'OLLENDE Crépin', specialty: 'Chirurgien', status: 'Résident', created_at: new Date() },
];