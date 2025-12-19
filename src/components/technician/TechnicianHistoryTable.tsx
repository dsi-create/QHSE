import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icon } from "@/components/Icon";
import { Incident } from "@/types";
import { format } from 'date-fns';

interface TechnicianHistoryTableProps {
  interventions: Incident[];
}

export const TechnicianHistoryTable = ({ interventions }: TechnicianHistoryTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="History" className="text-gray-600 mr-2" />
          Historique de mes Interventions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Ticket</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interventions.length > 0 ? interventions.map(task => (
              <TableRow key={task.id}>
                <TableCell>{format(task.report?.report_date || task.date_creation, 'dd/MM/yyyy')}</TableCell>
                <TableCell className="font-mono text-sm">{task.id.substring(0, 17)}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>{task.lieu}</TableCell>
                <TableCell>{task.statut}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Icon name="History" className="mx-auto text-4xl text-gray-300 mb-2" />
                  Aucun historique d'intervention
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};