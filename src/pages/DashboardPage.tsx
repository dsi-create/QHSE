import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Icon } from '@/components/Icon';
import { User, Incident, IncidentStatus, InterventionReport, IncidentPriority, Visitor, BiomedicalEquipment, MaintenanceTask, Notification, UserRole, Users, Room, Booking, Doctor, BiomedicalEquipmentStatus, PlannedTask, PlannedTaskStatus, Civility } from '@/types';
import { roleConfig } from '@/lib/data';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { SuperAdminPortal, AgentSecuritePortal, AgentEntretienPortal, TechnicienPortal, SuperviseurQHSEPortal, MedecinPortal, SecretairePortal, SuperviseurSecuritePortal, SuperviseurEntretienPortal, SuperviseurTechnicienPortal, BiomedicalPortal } from '@/components/portals';
// Import des nouveaux composants de tableau de bord
import { SuperadminDashboard } from '@/components/dashboards/SuperadminDashboard';
import { SecurityDashboard } from '@/components/dashboards/SecurityDashboard';
import ReportProblemForm from '@/components/maintenance/ReportProblemForm';
import AssignedTasksTable from '@/components/maintenance/AssignedTasksTable';
import { UserManagement } from '@/components/qhse/UserManagement';
import { TechnicianInterventionsTable } from '@/components/technician/TechnicianInterventionsTable';
import { TechnicianHistoryTable } from '@/components/technician/TechnicianHistoryTable';
import { InterventionReportDialog } from '@/components/technician/InterventionReportDialog';
import { QhseTicketsTable } from '@/components/qhse/QhseTicketsTable';
import { PlanInterventionForm } from '@/components/qhse/PlanInterventionForm';
import { ReportSecurityIncidentForm } from '@/components/security/ReportSecurityIncidentForm';
import { VisitorLog } from '@/components/shared/VisitorLog';
import { EquipmentList } from '@/components/biomedical/EquipmentList';
import { AddEquipmentDialog } from '@/components/biomedical/AddEquipmentDialog';
import { MaintenanceSchedule } from '@/components/biomedical/MaintenanceSchedule';
import { ScheduleMaintenanceDialog } from '@/components/biomedical/ScheduleMaintenanceDialog';
import { RoomSchedule } from '@/components/planning/RoomSchedule';
import { DoctorList } from '@/components/qhse/DoctorList';
import { DashboardCard } from '@/components/shared/DashboardCard';
import { SecurityIncidentsTable } from '@/components/security/SecurityIncidentsTable';
import { MaintenanceHistoryTable } from '@/components/maintenance/MaintenanceHistoryTable';
import { MyTasks } from '@/components/agent/MyTasks';
import { TaskPlanning } from '@/components/qhse/TaskPlanning';
import { PersonalInfo } from '@/components/shared/PersonalInfo';
import { KpiDashboard } from '@/components/dashboards/KpiDashboard';
import { GlobalRoomOverview } from '@/components/planning/GlobalRoomOverview'; // Import du nouveau composant
import { QHSEDocumentsList, AuditsList, TrainingsList, MedicalWasteList, SterilizationCyclesList, SterilizationRegisterList, RisksList, LaundryTrackingList } from '@/components/qhse';

// Props de la page principale
interface DashboardPageProps {
  user: User;
  username: string;
  onLogout: () => void;
  onResetData: () => void;
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'date_creation' | 'reported_by' | 'photo_urls'>, files: File[]) => void;
  updateIncidentStatus: (incidentId: string, newStatus: IncidentStatus) => void;
  addInterventionReport: (incidentId: string, report: Omit<InterventionReport, 'report_date' | 'technician_name'>) => void;
  assignTicket: (incidentId: string, assignedTo: string, priority: IncidentPriority, deadline: Date) => void;
  unassignTicket: (incidentId: string) => void;
  planIntervention: (intervention: Omit<Incident, 'id' | 'date_creation' | 'reported_by' | 'statut' | 'photo_urls'>) => void;
  visitors: Visitor[];
  addVisitor: (visitor: Omit<Visitor, 'id' | 'entry_time' | 'registered_by'>) => void;
  signOutVisitor: (visitorId: string) => void;
  biomedicalEquipment: BiomedicalEquipment[];
  addBiomedicalEquipment: (equipment: Omit<BiomedicalEquipment, 'id' | 'status' | 'last_maintenance' | 'next_maintenance' | 'model' | 'department' | 'created_at'>) => void;
  updateBiomedicalEquipmentStatus: (equipmentId: string, status: BiomedicalEquipmentStatus) => void;
  maintenanceTasks: MaintenanceTask[];
  scheduleMaintenanceTask: (task: Omit<MaintenanceTask, 'id' | 'status' | 'created_at'>) => void;
  notifications: Notification[];
  markNotificationsAsRead: (userId: string) => void;
  users: Users;
  addUser: (username: string, user: { first_name: string; last_name: string; email: string; password?: string; role: UserRole; civility: Civility; position: string; pin?: string; }) => void; // Updated type
  deleteUser: (username: string) => void;
  updateUserPermissions: (username: string, permissions: { added: string[], removed: string[] }) => void;
  rooms: Room[];
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'booked_by' | 'status' | 'created_at'>) => void;
  updateBooking: (bookingId: string, updatedData: Omit<Booking, 'id' | 'booked_by' | 'created_at'>) => void;
  deleteBooking: (bookingId: string) => void;
  doctors: Doctor[];
  plannedTasks: PlannedTask[];
  addPlannedTask: (task: Omit<PlannedTask, 'id' | 'created_by' | 'status' | 'created_at'>) => void;
  updatePlannedTaskStatus: (taskId: string, status: PlannedTaskStatus) => void;
  deletePlannedTask: (taskId: string) => void;
  expiringBookingIds: Set<string>;
  preExpiringBookingIds: Set<string>;
  startBooking: (bookingId: string, pin: string) => Promise<boolean>; // Changed to Promise<boolean>
  endBooking: (bookingId: string) => void;
  onUpdatePassword: (newPassword: string) => Promise<boolean>;
}

// Définition des composants pour chaque vue
const MaintenanceDashboard = ({ incidents, addIncident, updateIncidentStatus, setActiveTab }: any) => {
    const maintenanceIncidents = incidents.filter((i: Incident) => i.service === 'entretien');
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <Icon name="SprayCan" className="text-green-600 mr-2" />Tableau de Bord Entretien
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard title="Tâches Aujourd'hui" value={maintenanceIncidents.filter((i: Incident) => new Date(i.date_creation).toDateString() === new Date().toDateString()).length} iconName="ListChecks" colorClass="bg-blue-100 text-blue-600" />
            <DashboardCard title="En Attente" value={maintenanceIncidents.filter((i: Incident) => i.statut === 'nouveau' || i.statut === 'attente').length} iconName="Hourglass" colorClass="bg-yellow-100 text-yellow-600" />
            <DashboardCard title="Terminées" value={maintenanceIncidents.filter((i: Incident) => i.statut === 'resolu').length} iconName="CheckCheck" colorClass="bg-green-100 text-green-600" onClick={() => setActiveTab('maintenanceHistory')} />
            <DashboardCard title="Urgentes" value={maintenanceIncidents.filter((i: Incident) => i.priorite === 'haute' || i.priorite === 'critique').length} iconName="AlertTriangle" colorClass="bg-red-100 text-red-600" />
        </div>
        <div className="space-y-6">
            <ReportProblemForm onAddIncident={addIncident} />
            <AssignedTasksTable incidents={incidents} onUpdateIncidentStatus={updateIncidentStatus} />
        </div>
      </div>
    );
};

const TechnicianDashboard = ({ incidents, updateIncidentStatus, addInterventionReport, username }: any) => {
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const technicalIncidents = incidents.filter((i: Incident) => i.service === 'technique' && i.assigned_to === username);
    const activeInterventions = technicalIncidents.filter((i: Incident) => i.statut === 'nouveau' || i.statut === 'cours' || i.statut === 'attente');
    const completedInterventions = technicalIncidents.filter((i: Incident) => i.statut === 'traite' || i.statut === 'resolu');

    const handleSubmitReport = (report: Omit<InterventionReport, 'report_date' | 'technician_name'>) => {
        if (selectedIncident) {
            addInterventionReport(selectedIncident.id, report);
            setSelectedIncident(null);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Icon name="Wrench" className="text-orange-600 mr-2" />Tableau de Bord Technicien
            </h2>
            <TechnicianInterventionsTable 
                interventions={activeInterventions} 
                onUpdateStatus={updateIncidentStatus}
                onOpenReportDialog={setSelectedIncident}
            />
            <TechnicianHistoryTable interventions={completedInterventions} />
            {selectedIncident && (
                <InterventionReportDialog
                    incident={selectedIncident}
                    isOpen={!!selectedIncident}
                    onClose={() => setSelectedIncident(null)}
                    onSubmit={handleSubmitReport}
                />
            )}
        </div>
    );
};

const QHSEDashboard = ({ incidents, updateIncidentStatus, assignTicket, unassignTicket, planIntervention, user, users }: any) => {
  // Seul le superviseur QHSE peut planifier des interventions
  const canPlanIntervention = user.role === 'superviseur_qhse' || user.role === 'superadmin';
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <Icon name="UserCog" className="text-cyan-600 mr-2" />Dashboard Superviseur QHSE
      </h2>
      <QhseTicketsTable incidents={incidents} onUpdateStatus={updateIncidentStatus} onAssignTicket={assignTicket} onUnassignTicket={unassignTicket} users={users} currentUserRole={user.role} />
      {canPlanIntervention && (
        <PlanInterventionForm onPlanIntervention={planIntervention} currentUser={user} users={users} />
      )}
    </div>
  );
};

const BiomedicalDashboard = ({ biomedicalEquipment, addBiomedicalEquipment, updateBiomedicalEquipmentStatus, scheduleMaintenanceTask, maintenanceTasks, users }: any) => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Icon name="HeartPulse" className="text-red-600 mr-2" />
          Gestion des Équipements Biomédicaux
        </h2>
        <div className="flex space-x-2">
          <AddEquipmentDialog onAddEquipment={addBiomedicalEquipment} />
          <ScheduleMaintenanceDialog equipment={biomedicalEquipment} onScheduleTask={scheduleMaintenanceTask} users={users} />
        </div>
      </div>
      <EquipmentList equipment={biomedicalEquipment} onUpdateStatus={updateBiomedicalEquipmentStatus} />
      <MaintenanceSchedule tasks={maintenanceTasks} equipment={biomedicalEquipment} />
    </div>
);

const DashboardPage = (props: DashboardPageProps) => {
  const { user, username, onLogout, notifications, markNotificationsAsRead, onUpdatePassword } = props;
  
  const userTabs = roleConfig[user.role];
  
  // Déterminer le portail par défaut selon le rôle
  const getDefaultPortal = () => {
    switch (user.role) {
      case 'superadmin':
        return 'portalSuperadmin';
      case 'agent_securite':
        return 'portalAgentSecurite';
      case 'agent_entretien':
        return 'portalAgentEntretien';
      case 'technicien':
        return 'portalTechnicien';
      case 'superviseur_qhse':
        return 'portalSuperviseurQHSE';
      case 'superviseur_agent_securite':
        return 'portalSuperviseurSecurite';
      case 'superviseur_agent_entretien':
        return 'portalSuperviseurEntretien';
      case 'superviseur_technicien':
        return 'portalSuperviseurTechnicien';
      case 'medecin':
        return 'portalMedecin';
      case 'secretaire':
        return 'portalSecretaire';
      case 'biomedical':
        return 'portalBiomedical';
      default:
        return userTabs && userTabs.length > 0 ? userTabs[0].id : 'dashboardSuperadmin';
    }
  };
  
  const [activeTab, setActiveTab] = useState(getDefaultPortal());

  const isMobile = useIsMobile();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const NavLinks = () => (
    userTabs && userTabs.length > 0 ? userTabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => {
          setActiveTab(tab.id);
          if (isMobile) setIsMobileNavOpen(false);
        }}
        className={`
          relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out
          ${activeTab === tab.id 
            ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 text-white shadow-lg transform scale-105' 
            : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }
          hover:scale-105 active:scale-95
          flex items-center space-x-2
        `}
      >
        <Icon name={tab.icon} className="h-4 w-4" />
        <span>{tab.name}</span>
        {activeTab === tab.id && (
          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/50 rounded-full"></span>
        )}
      </button>
    )) : null
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      // Portails personnalisés
      case 'portalSuperadmin':
        return <SuperAdminPortal 
          user={user}
          incidents={props.incidents}
          visitors={props.visitors}
          plannedTasks={props.plannedTasks}
          bookings={props.bookings}
          notifications={props.notifications}
          users={props.users}
          onNavigate={setActiveTab}
        />;
      case 'portalAgentSecurite':
        return <AgentSecuritePortal 
          user={user}
          incidents={props.incidents}
          visitors={props.visitors}
          plannedTasks={props.plannedTasks}
          bookings={props.bookings}
          notifications={props.notifications}
          onNavigate={setActiveTab}
        />;
      case 'portalAgentEntretien':
        return <AgentEntretienPortal 
          user={user}
          incidents={props.incidents}
          visitors={props.visitors}
          plannedTasks={props.plannedTasks}
          bookings={props.bookings}
          notifications={props.notifications}
          onNavigate={setActiveTab}
        />;
      case 'portalTechnicien':
        return <TechnicienPortal 
          user={user}
          incidents={props.incidents}
          plannedTasks={props.plannedTasks}
          notifications={props.notifications}
          onNavigate={setActiveTab}
        />;
      case 'portalSuperviseurQHSE':
        return <SuperviseurQHSEPortal 
          user={user}
          incidents={props.incidents}
          visitors={props.visitors}
          plannedTasks={props.plannedTasks}
          bookings={props.bookings}
          notifications={props.notifications}
          users={props.users}
          onNavigate={setActiveTab}
        />;
      case 'portalMedecin':
        return <MedecinPortal 
          user={user}
          bookings={props.bookings}
          notifications={props.notifications}
          onNavigate={setActiveTab}
        />;
      case 'portalSecretaire':
        return <SecretairePortal 
          user={user}
          visitors={props.visitors}
          bookings={props.bookings}
          notifications={props.notifications}
          onNavigate={setActiveTab}
        />;
      case 'portalSuperviseurSecurite':
        return <SuperviseurSecuritePortal 
          user={user}
          incidents={props.incidents}
          visitors={props.visitors}
          plannedTasks={props.plannedTasks}
          bookings={props.bookings}
          notifications={props.notifications}
          users={props.users}
          onNavigate={setActiveTab}
        />;
      case 'portalSuperviseurEntretien':
        return <SuperviseurEntretienPortal 
          user={user}
          incidents={props.incidents}
          plannedTasks={props.plannedTasks}
          notifications={props.notifications}
          users={props.users}
          onNavigate={setActiveTab}
        />;
      case 'portalSuperviseurTechnicien':
        return <SuperviseurTechnicienPortal 
          user={user}
          incidents={props.incidents}
          plannedTasks={props.plannedTasks}
          notifications={props.notifications}
          users={props.users}
          onNavigate={setActiveTab}
        />;
      case 'portalBiomedical':
        return <BiomedicalPortal
          user={user}
          biomedicalEquipment={props.biomedicalEquipment}
          maintenanceTasks={props.maintenanceTasks}
          onNavigate={setActiveTab}
        />;
      
      // Modules existants
      case 'dashboardSuperadmin':
        return <SuperadminDashboard 
          incidents={props.incidents} 
          users={props.users} 
          biomedicalEquipment={props.biomedicalEquipment} 
          bookings={props.bookings} 
          plannedTasks={props.plannedTasks}
          visitors={props.visitors}
          onResetData={props.onResetData} 
          setActiveTab={setActiveTab} 
        />;
      case 'dashboardSecurite':
        return <SecurityDashboard incidents={props.incidents.filter(i => i.service === 'securite')} setActiveTab={setActiveTab} />;
      case 'dashboardEntretien':
        return <MaintenanceDashboard incidents={props.incidents.filter(i => i.service === 'entretien')} addIncident={props.addIncident} updateIncidentStatus={props.updateIncidentStatus} setActiveTab={setActiveTab} />;
      case 'dashboardTechnicien':
        return <TechnicianDashboard incidents={props.incidents} updateIncidentStatus={props.updateIncidentStatus} addInterventionReport={props.addInterventionReport} username={username} />;
      case 'dashboardQHSE':
        return <QHSEDashboard incidents={props.incidents} updateIncidentStatus={props.updateIncidentStatus} assignTicket={props.assignTicket} unassignTicket={props.unassignTicket} planIntervention={props.planIntervention} user={user} users={props.users} />;
      case 'qhseTickets':
        const serviceFilter = user.role === 'superviseur_agent_securite' ? 'securite' :
                              user.role === 'superviseur_agent_entretien' ? 'entretien' :
                              user.role === 'superviseur_technicien' ? 'technique' : 'all';
        const filteredIncidents = serviceFilter === 'all' ? props.incidents : props.incidents.filter(i => i.service === serviceFilter);
        return <QhseTicketsTable incidents={filteredIncidents} onUpdateStatus={props.updateIncidentStatus} onAssignTicket={props.assignTicket} onUnassignTicket={props.unassignTicket} users={props.users} currentUserRole={user.role} />;
      case 'reportIncident':
        return user.role === 'agent_securite' || user.role === 'superviseur_agent_securite' ? <ReportSecurityIncidentForm onAddIncident={props.addIncident} /> : <ReportProblemForm onAddIncident={props.addIncident} />;
      case 'visitorLog':
        return <VisitorLog visitors={props.visitors} onAddVisitor={props.addVisitor} onSignOutVisitor={props.signOutVisitor} users={props.users} doctors={props.doctors} />;
      case 'biomedical':
        return <BiomedicalDashboard biomedicalEquipment={props.biomedicalEquipment} addBiomedicalEquipment={props.addBiomedicalEquipment} updateBiomedicalEquipmentStatus={props.updateBiomedicalEquipmentStatus} scheduleMaintenanceTask={props.scheduleMaintenanceTask} maintenanceTasks={props.maintenanceTasks} users={props.users} />;
      case 'planningSalles':
        return <RoomSchedule 
          rooms={props.rooms} 
          bookings={props.bookings} 
          users={props.users} 
          doctors={props.doctors} 
          onAddBooking={props.addBooking}
          updateBooking={props.updateBooking} 
          deleteBooking={props.deleteBooking} 
          currentUser={user}
          currentUserRole={user.role} 
          currentUsername={username}
          expiringBookingIds={props.expiringBookingIds} 
          preExpiringBookingIds={props.preExpiringBookingIds}
          onStartBooking={props.startBooking}
          onEndBooking={props.endBooking}
        />;
      case 'doctors':
        return <DoctorList doctors={props.doctors} rooms={props.rooms} onAddBooking={props.addBooking} />;
      case 'settings':
        return <UserManagement currentUserRole={user.role} users={props.users} addUser={props.addUser} deleteUser={props.deleteUser} updateUserPermissions={props.updateUserPermissions} />;
      case 'securityIncidents':
        return <SecurityIncidentsTable incidents={props.incidents.filter(i => i.service === 'securite')} />;
      case 'maintenanceHistory':
        const completedMaintenance = props.incidents.filter(i => i.service === 'entretien' && (i.statut === 'resolu' || i.statut === 'traite'));
        return <MaintenanceHistoryTable interventions={completedMaintenance} />;
      case 'myTasks':
        const myTasks = props.plannedTasks.filter(task => task.assigned_to === props.user.id); // Filter by user ID
        return <MyTasks tasks={myTasks} onUpdateStatus={props.updatePlannedTaskStatus} />;
      case 'planningTasks':
        const tasksForSupervisor = user.role === 'superviseur_agent_securite' ? props.plannedTasks.filter(t => props.users[Object.keys(props.users).find(key => props.users[key].id === t.assigned_to)!]?.role === 'agent_securite') :
                                   user.role === 'superviseur_agent_entretien' ? props.plannedTasks.filter(t => props.users[Object.keys(props.users).find(key => props.users[key].id === t.assigned_to)!]?.role === 'agent_entretien') :
                                   user.role === 'superviseur_technicien' ? props.plannedTasks.filter(t => props.users[Object.keys(props.users).find(key => props.users[key].id === t.assigned_to)!]?.role === 'technicien') :
                                   props.plannedTasks;
        return <TaskPlanning tasks={tasksForSupervisor} users={props.users} onAddTask={props.addPlannedTask} onDeleteTask={props.deletePlannedTask} currentUserRole={user.role} />;
      case 'personalInfo':
        return <PersonalInfo user={props.user} onUpdatePassword={onUpdatePassword} />;
      case 'kpiDashboard':
        return <KpiDashboard 
          incidents={props.incidents} 
          biomedicalEquipment={props.biomedicalEquipment} 
          plannedTasks={props.plannedTasks} 
          visitors={props.visitors} 
          bookings={props.bookings} 
          users={props.users}
          maintenanceTasks={props.maintenanceTasks}
        />;
      case 'globalRoomOverview': // Nouveau cas pour la vue globale des salles
        return <GlobalRoomOverview 
          rooms={props.rooms} 
          bookings={props.bookings} 
          users={props.users} 
          doctors={props.doctors} 
        />;
      // Modules QHSE
      case 'qhseDocuments':
        return <QHSEDocumentsList currentUser={{ username, details: user }} />;
      case 'qhseAudits':
        return <AuditsList />;
      case 'qhseTrainings':
        return <TrainingsList />;
      case 'qhseWaste':
        return <MedicalWasteList />;
      case 'qhseSterilization':
        return <SterilizationCyclesList />;
      case 'qhseSterilizationRegister':
        return <SterilizationRegisterList />;
      case 'qhseRisks':
        return <RisksList />;
      case 'qhseLaundry':
        return <LaundryTrackingList />;
      case 'qhseReports':
        return <div className="text-center py-10 text-gray-500">
          <Icon name="FileBarChart" className="mx-auto text-4xl text-gray-300 mb-2" />
          <p>Module de Reporting en cours de développement</p>
        </div>;
      default:
        return <SuperadminDashboard 
          incidents={props.incidents} 
          users={props.users} 
          biomedicalEquipment={props.biomedicalEquipment} 
          bookings={props.bookings} 
          plannedTasks={props.plannedTasks}
          visitors={props.visitors}
          onResetData={props.onResetData} 
          setActiveTab={setActiveTab} 
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/20 to-blue-50/30">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            {isMobile && (
              <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="btn-animate">
                    <Icon name="Menu" className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                  <nav className="flex flex-col pt-6">
                    <NavLinks />
                  </nav>
                </SheetContent>
              </Sheet>
            )}
            <div className="flex items-center space-x-3">
              <img src="https://page1.genspark.site/v1/base64_upload/85255e9e3f43d5940a170bdbd6d7b858" alt="Logo CDL" className="h-10 w-10 md:h-12 md:w-12 rounded-lg shadow-md" />
              {!isMobile && (
                <div>
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                    Centre Diagnostic Libreville
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">
                    {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setActiveTab(userTabs && userTabs.length > 0 ? userTabs[0].id : 'dashboardSuperadmin')}
              className="hidden md:flex items-center text-gray-600 hover:text-cyan-600 btn-animate"
            >
              <Icon name="LayoutDashboard" className="mr-2 h-4 w-4" /> Tableau de Bord
            </Button>
            <NotificationBell 
              userId={user.id}
              notifications={notifications} 
              onMarkAsRead={markNotificationsAsRead} 
              onNotificationClick={(link) => setActiveTab(link)}
            />
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-100">
              <Icon name="User" className="h-4 w-4 text-cyan-600" />
              <span className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">{user.first_name} {user.last_name}</span>
              </span>
            </div>
            <Button onClick={onLogout} variant="destructive" className="btn-animate">
              <Icon name="LogOut" className="md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      {!isMobile && (
        <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl border-b border-gray-700/50">
          <div className="px-6 flex space-x-1 overflow-x-auto">
            <NavLinks />
          </div>
        </nav>
      )}

      <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto fade-in">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default DashboardPage;