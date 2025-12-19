import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Icon } from "@/components/Icon";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { Incident } from "@/types";

interface SecurityDashboardProps {
  incidents: Incident[];
  setActiveTab: (tabId: string) => void;
}

export const SecurityDashboard = ({ incidents, setActiveTab }: SecurityDashboardProps) => {
  const typeData = incidents.reduce((acc, incident) => {
    const type = incident.type;
    const existing = acc.find(item => item.name === type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: type, value: 1 });
    }
    return acc;
  }, [] as { name: string, value: number }[]);

  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
  const weekData = last7Days.map(day => ({
    name: format(day, 'eee', { locale: fr }),
    incidents: incidents.filter(inc => format(inc.date_creation, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <Icon name="Shield" className="text-blue-600 mr-2" />Tableau de Bord Sécurité & Accueil
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Incidents Aujourd'hui" value={incidents.filter(i => new Date(i.date_creation).toDateString() === new Date().toDateString()).length} iconName="AlertCircle" colorClass="bg-blue-100 text-blue-600" onClick={() => setActiveTab('securityIncidents')} />
        <DashboardCard title="En Cours" value={incidents.filter(i => i.statut === 'cours').length} iconName="Clock" colorClass="bg-yellow-100 text-yellow-600" onClick={() => setActiveTab('securityIncidents')} />
        <DashboardCard title="Résolus" value={incidents.filter(i => i.statut === 'resolu').length} iconName="CheckCircle2" colorClass="bg-green-100 text-green-600" onClick={() => setActiveTab('securityIncidents')} />
        <DashboardCard title="Priorité Haute" value={incidents.filter(i => i.priorite === 'haute' || i.priorite === 'critique').length} iconName="AlertTriangle" colorClass="bg-red-100 text-red-600" onClick={() => setActiveTab('securityIncidents')} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Répartition par Type</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={typeData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" label>
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Évolution sur 7 jours</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="incidents" stroke="#8884d8" activeDot={{ r: 8 }} name="Incidents" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};