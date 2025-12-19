import { UserRole } from '@/types';

export const allPermissions = [
  { id: 'portalSuperadmin', name: 'Mon Portail', icon: 'Home' },
  { id: 'portalAgentSecurite', name: 'Mon Portail', icon: 'Home' },
  { id: 'portalAgentEntretien', name: 'Mon Portail', icon: 'Home' },
  { id: 'portalTechnicien', name: 'Mon Portail', icon: 'Home' },
  { id: 'portalSuperviseurQHSE', name: 'Mon Portail', icon: 'Home' },
  { id: 'portalSuperviseurSecurite', name: 'Mon Portail', icon: 'Home' },
  { id: 'portalSuperviseurEntretien', name: 'Mon Portail', icon: 'Home' },
  { id: 'portalSuperviseurTechnicien', name: 'Mon Portail', icon: 'Home' },
  { id: 'portalBiomedical', name: 'Portail Biomédical', icon: 'HeartPulse' },
  { id: 'portalMedecin', name: 'Mon Portail', icon: 'Home' },
  { id: 'portalSecretaire', name: 'Mon Portail', icon: 'Home' },
  { id: 'dashboardSuperadmin', name: 'Dashboard Superadmin', icon: 'Crown' },
  { id: 'dashboardSecurite', name: 'Dashboard Sécurité', icon: 'Shield' },
  { id: 'dashboardEntretien', name: 'Dashboard Entretien', icon: 'SprayCan' },
  { id: 'dashboardTechnicien', name: 'Dashboard Technicien', icon: 'Wrench' },
  { id: 'dashboardQHSE', name: 'Dashboard QHSE', icon: 'UserCog' },
  { id: 'qhseTickets', name: 'Gestion Tickets', icon: 'Ticket' },
  { id: 'reportIncident', name: 'Signaler Incident', icon: 'AlertCircle' },
  { id: 'visitorLog', name: 'Registre Visiteurs', icon: 'BookUser' },
  { id: 'biomedical', name: 'Biomédical', icon: 'HeartPulse' },
  { id: 'planningSalles', name: 'Planning Salles', icon: 'Calendar' },
  { id: 'doctors', name: 'Annuaire Médecins', icon: 'Stethoscope' },
  { id: 'settings', name: 'Gestion Utilisateurs', icon: 'Settings' },
  { id: 'securityIncidents', name: 'Liste Incidents Sécurité', icon: 'ListChecks' },
  { id: 'maintenanceHistory', name: 'Historique Entretien', icon: 'History' },
  { id: 'myTasks', name: 'Mes Tâches', icon: 'ClipboardList' },
  { id: 'planningTasks', name: 'Planning Tâches', icon: 'CalendarPlus' },
  { id: 'personalInfo', name: 'Mes Infos', icon: 'User' },
  { id: 'kpiDashboard', name: 'KPIs', icon: 'BarChart' },
  { id: 'globalRoomOverview', name: 'Vue Globale Salles', icon: 'MapPin' },
  // Modules QHSE
  { id: 'qhseDocuments', name: 'Gestion Documentaire', icon: 'FileText' },
  { id: 'qhseAudits', name: 'Audits & Inspections', icon: 'ClipboardCheck' },
  { id: 'qhseTrainings', name: 'Formations & Compétences', icon: 'GraduationCap' },
  { id: 'qhseWaste', name: 'Déchets Médicaux', icon: 'Trash2' },
  { id: 'qhseSterilization', name: 'Stérilisation & Linge', icon: 'Droplet' },
  { id: 'qhseSterilizationRegister', name: 'Registre Stérilisation', icon: 'FileCheck' },
  { id: 'qhseLaundry', name: 'Suivi Buanderie', icon: 'Shirt' },
  { id: 'qhseRisks', name: 'Gestion des Risques', icon: 'AlertTriangle' },
  { id: 'qhseReports', name: 'Reporting & Exportation', icon: 'FileBarChart' },
];

const findPerms = (ids: string[]) => allPermissions.filter(p => ids.includes(p.id));

export const roleConfig: Record<UserRole, { id: string; name: string; icon: string; }[]> = {
  superadmin: [
    { id: 'portalSuperadmin', name: 'Mon Portail', icon: 'Home' },
    { id: 'portalBiomedical', name: 'Portail Biomédical', icon: 'HeartPulse' },
    ...allPermissions.filter(p => !p.id.startsWith('portal'))
  ],
  superviseur_qhse: [
    { id: 'portalSuperviseurQHSE', name: 'Mon Portail', icon: 'Home' },
    { id: 'portalBiomedical', name: 'Portail Biomédical', icon: 'HeartPulse' },
    ...findPerms(['dashboardQHSE', 'qhseTickets', 'biomedical', 'planningSalles', 'doctors', 'settings', 'planningTasks', 'kpiDashboard', 'personalInfo', 'globalRoomOverview', 'qhseDocuments', 'qhseAudits', 'qhseTrainings', 'qhseWaste', 'qhseSterilization', 'qhseSterilizationRegister', 'qhseLaundry', 'qhseRisks', 'qhseReports'])
  ],
  secretaire: [{ id: 'portalSecretaire', name: 'Mon Portail', icon: 'Home' }, ...findPerms(['planningSalles', 'visitorLog', 'doctors', 'personalInfo', 'globalRoomOverview'])],
  medecin: [{ id: 'portalMedecin', name: 'Mon Portail', icon: 'Home' }, ...findPerms(['planningSalles', 'personalInfo'])],
  superviseur_agent_securite: [{ id: 'portalSuperviseurSecurite', name: 'Mon Portail', icon: 'Home' }, ...findPerms(['dashboardSecurite', 'securityIncidents', 'visitorLog', 'planningTasks', 'settings', 'personalInfo', 'reportIncident'])],
  agent_securite: [{ id: 'portalAgentSecurite', name: 'Mon Portail', icon: 'Home' }, ...findPerms(['dashboardSecurite', 'reportIncident', 'securityIncidents', 'visitorLog', 'myTasks', 'personalInfo'])],
  superviseur_agent_entretien: [{ id: 'portalSuperviseurEntretien', name: 'Mon Portail', icon: 'Home' }, ...findPerms(['dashboardEntretien', 'dashboardQHSE', 'qhseTickets', 'maintenanceHistory', 'planningTasks', 'settings', 'personalInfo', 'reportIncident'])],
  agent_entretien: [{ id: 'portalAgentEntretien', name: 'Mon Portail', icon: 'Home' }, ...findPerms(['dashboardEntretien', 'dashboardQHSE', 'qhseTickets', 'reportIncident', 'maintenanceHistory', 'myTasks', 'personalInfo'])],
  superviseur_technicien: [
    { id: 'portalSuperviseurTechnicien', name: 'Mon Portail', icon: 'Home' },
    { id: 'portalBiomedical', name: 'Portail Biomédical', icon: 'HeartPulse' },
    ...findPerms(['dashboardTechnicien', 'dashboardQHSE', 'qhseTickets', 'biomedical', 'planningTasks', 'settings', 'personalInfo'])
  ],
  technicien: [
    { id: 'portalTechnicien', name: 'Mon Portail', icon: 'Home' },
    { id: 'portalBiomedical', name: 'Portail Biomédical', icon: 'HeartPulse' },
    ...findPerms(['dashboardTechnicien', 'dashboardQHSE', 'qhseTickets', 'biomedical', 'myTasks', 'personalInfo'])
  ],
  biomedical: [
    { id: 'portalBiomedical', name: 'Portail Biomédical', icon: 'HeartPulse' },
    ...findPerms(['biomedical', 'maintenanceHistory', 'planningTasks', 'kpiDashboard', 'personalInfo'])
  ],
};

export const visitorDestinations = [
    { label: "Accueil & Services Généraux", options: ["Accueil", "Administration", "Direction"] },
    { label: "Consultations", options: ["Consultation Générale", "Consultation Spécialisée", "Pédiatrie", "Gynécologie"] },
    { label: "Services Techniques", options: ["Imagerie Médicale", "Laboratoire", "Bloc Opératoire"] },
    { label: "Hospitalisation", options: ["Hospitalisation 1er étage", "Hospitalisation 2e étage", "Maternité"] },
];

export const visitReasons = [
    "Consultation",
    "Visite à un patient",
    "Livraison",
    "Rendez-vous professionnel",
    "Maintenance",
    "Autre",
];

export const bookingReasons = [
    "Consultation",
    "Réunion d'équipe",
    "Formation",
    "Intervention",
    "Entretien",
    "Autre",
];