import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/Icon';
import { Incident, Users, IncidentPriority, IncidentStatus } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface IncidentDetailsPageProps {
  incidents: Incident[];
  users: Users;
}

const priorityClasses: Record<IncidentPriority, string> = {
  haute: "bg-red-500",
  moyenne: "bg-yellow-500",
  faible: "bg-green-500",
  critique: "bg-red-700",
};

const statusClasses: Record<IncidentStatus, string> = {
  nouveau: "bg-blue-500",
  cours: "bg-yellow-500",
  traite: "bg-purple-500",
  resolu: "bg-green-500",
  attente: "bg-gray-500",
};

const IncidentDetailsPage = ({ incidents, users }: IncidentDetailsPageProps) => {
  const { id } = useParams<{ id: string }>();
  const incident = incidents.find(i => i.id === id);

  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <Icon name="AlertTriangle" className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Incident non trouvé</h1>
        <p className="text-gray-600 mb-4">L'incident que vous recherchez n'existe pas ou a été déplacé.</p>
        <Link to="/" className="text-blue-600 hover:underline">Retour au tableau de bord</Link>
      </div>
    );
  }

  const assignedUserName = incident.assigned_to ? users[Object.keys(users).find(key => users[key].id === incident.assigned_to)!]?.name : 'Non assigné';
  const reportedByUserName = incident.reported_by ? users[Object.keys(users).find(key => users[key].id === incident.reported_by)!]?.name : 'Inconnu';

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <Link to="/" className="text-blue-600 hover:underline flex items-center mb-4">
          <Icon name="ChevronLeft" className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Détails du Ticket</h1>
        <p className="text-gray-500 font-mono">{incident.id}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description de l'incident</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{incident.description}</p>
            </CardContent>
          </Card>

          {incident.photo_urls && incident.photo_urls.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Photos</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {incident.photo_urls.map((photoUrl, index) => (
                  <img key={index} src={photoUrl} alt={`preuve ${index + 1}`} className="rounded-lg object-cover w-full h-40" />
                ))}
              </CardContent>
            </Card>
          )}

          {incident.report && (
            <Card>
              <CardHeader>
                <CardTitle>Rapport d'Intervention</CardTitle>
                <CardDescription>Rapport soumis par {incident.report.technician_name} le {format(incident.report.report_date, 'PPP', { locale: fr })}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Actions Réalisées</h4>
                  <p>{incident.report.actions_taken}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Matériel Utilisé</h4>
                  <p>{incident.report.materials_used || 'Aucun'}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Recommandations</h4>
                  <p>{incident.report.recommendations || 'Aucune'}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Informations Clés</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Statut</span>
                <Badge className={`${statusClasses[incident.statut]} hover:${statusClasses[incident.statut]}`}>{incident.statut}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Priorité</span>
                <Badge className={`${priorityClasses[incident.priorite]} hover:${priorityClasses[incident.priorite]}`}>{incident.priorite}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Service</span>
                <span>{incident.service}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Lieu</span>
                <span>{incident.lieu}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Signalé par</span>
                <span>{reportedByUserName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Date de création</span>
                <span>{format(incident.date_creation, 'Pp', { locale: fr })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Assigné à</span>
                <span>{assignedUserName}</span>
              </div>
              {incident.deadline && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Échéance</span>
                  <span>{format(incident.deadline, 'Pp', { locale: fr })}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailsPage;