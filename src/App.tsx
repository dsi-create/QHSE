import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { doctors as initialDoctors } from '@/lib/doctors';
import { Incident, Visitor, BiomedicalEquipment, MaintenanceTask, Notification, User, Users, Room, Booking, Doctor, PlannedTask } from '@/types';
import { showSuccess, showError } from '@/utils/toast';
import { supabase } from './integrations/supabase/client';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import IncidentDetailsPage from './pages/IncidentDetailsPage';
import NotFound from "./pages/NotFound";

// Import custom hooks
import { useAuth } from './hooks/use-auth';
import { useIncidents } from './hooks/use-incidents';
import { useVisitors } from './hooks/use-visitors';
import { useBiomedicalEquipment } from './hooks/use-biomedical-equipment';
import { useNotifications } from './hooks/use-notifications';
import { useBookings } from './hooks/use-bookings';
import { usePlannedTasks } from './hooks/use-planned-tasks';
import { useUserManagement } from './hooks/use-user-management';

const queryClient = new QueryClient();

const App = () => {
  // Global states managed by App.tsx and passed to hooks
  const { currentUser, users, setUsers, handleLogin, handleLogout, setCurrentUser, updatePassword, fetchAllProfiles } = useAuth({ initialUsers: {} }); // Initial users will be fetched from DB
  const { notifications, addNotification, markNotificationsAsRead, setNotifications } = useNotifications();

  // Other hooks
  const { incidents, setIncidents, addIncident, updateIncidentStatus, addInterventionReport, assignTicket, unassignTicket, planIntervention } = useIncidents({ currentUser, users, addNotification });
  const { visitors, setVisitors, addVisitor, signOutVisitor } = useVisitors({ currentUser });
  const { biomedicalEquipment, setBiomedicalEquipment, maintenanceTasks, setMaintenanceTasks, addBiomedicalEquipment, updateBiomedicalEquipmentStatus, scheduleMaintenanceTask } = useBiomedicalEquipment({ addNotification });
  const { rooms, setRooms, bookings, setBookings, doctors, setDoctors, addBooking, updateBooking, deleteBooking, expiringBookingIds, preExpiringBookingIds, startBooking, endBooking } = useBookings({ currentUser, users, addNotification });
  const { plannedTasks, setPlannedTasks, addPlannedTask, updatePlannedTaskStatus, deletePlannedTask } = usePlannedTasks({ currentUser, users, addNotification });
  const { addUser, deleteUser, updateUserPermissions } = useUserManagement({ setUsers, fetchAllProfiles }); // Pass fetchAllProfiles

  // Effect to ensure Superadmin exists in Supabase
  useEffect(() => {
    const ensureSuperadmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { // Only run if no user is currently logged in
        console.log("App.tsx: Checking for superadmin in Supabase...");
        try {
          // Utiliser une requête anonyme pour vérifier l'existence du superadmin
          const { data: admins, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'superadmin')
            .limit(1);

          if (error) {
            // Si erreur RLS, ce n'est pas grave, on continue
            console.log("App.tsx: Could not check superadmin (RLS may be blocking):", error.message);
            return;
          }

          if (!admins || admins.length === 0) {
            console.log("App.tsx: No superadmin found in profiles table. Users should be created in Supabase Auth.");
          } else {
            console.log("App.tsx: Superadmin exists in Supabase profiles table.");
          }
        } catch (error: any) {
          console.log("App.tsx: Error checking for superadmin (non-critical):", error.message);
          // Ne pas bloquer l'application si cette vérification échoue
        }
      }
    };

    ensureSuperadmin();
  }, []);

  const handleResetData = async () => {
    // This function will need to be updated to clear data from Supabase
    // For now, it will only clear local state, which will be overwritten by DB fetches
    setIncidents([]);
    setVisitors([]);
    setBiomedicalEquipment([]);
    setMaintenanceTasks([]);
    setBookings([]);
    setNotifications([]);
    setPlannedTasks([]);
    setUsers({});
    setRooms([]);
    setDoctors([]);
    setCurrentUser(null);
    showSuccess("Toutes les données de l'application ont été réinitialisées (localement).");
    // In a real scenario, this would involve calling Supabase functions to truncate tables.
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {currentUser ? (
              <>
                <Route 
                  path="/" 
                  element={
                    <DashboardPage
                      user={currentUser.details}
                      username={currentUser.username}
                      onLogout={handleLogout}
                      onResetData={handleResetData}
                      incidents={incidents}
                      addIncident={addIncident}
                      updateIncidentStatus={updateIncidentStatus}
                      addInterventionReport={addInterventionReport}
                      assignTicket={assignTicket}
                      unassignTicket={unassignTicket}
                      planIntervention={planIntervention}
                      visitors={visitors}
                      addVisitor={addVisitor}
                      signOutVisitor={signOutVisitor}
                      biomedicalEquipment={biomedicalEquipment}
                      addBiomedicalEquipment={addBiomedicalEquipment}
                      updateBiomedicalEquipmentStatus={updateBiomedicalEquipmentStatus}
                      maintenanceTasks={maintenanceTasks}
                      scheduleMaintenanceTask={scheduleMaintenanceTask}
                      notifications={notifications}
                      markNotificationsAsRead={markNotificationsAsRead}
                      users={users}
                      addUser={addUser}
                      deleteUser={deleteUser}
                      updateUserPermissions={updateUserPermissions}
                      rooms={rooms}
                      bookings={bookings}
                      addBooking={addBooking}
                      updateBooking={updateBooking}
                      deleteBooking={deleteBooking}
                      doctors={doctors}
                      plannedTasks={plannedTasks}
                      addPlannedTask={addPlannedTask}
                      updatePlannedTaskStatus={updatePlannedTaskStatus}
                      deletePlannedTask={deletePlannedTask}
                      expiringBookingIds={expiringBookingIds}
                      preExpiringBookingIds={preExpiringBookingIds}
                      startBooking={startBooking}
                      endBooking={endBooking}
                      onUpdatePassword={updatePassword}
                    />
                  } 
                />
                <Route path="/incident/:id" element={<IncidentDetailsPage incidents={incidents} users={users} />} />
                <Route path="/login" element={<Navigate to="/" />} />
              </>
            ) : (
              <>
                <Route 
                  path="/login" 
                  element={
                    <LoginPage 
                      onLogin={handleLogin} 
                    />
                  } 
                />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;