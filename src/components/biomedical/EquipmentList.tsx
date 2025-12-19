import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/Icon";
import { BiomedicalEquipment, BiomedicalEquipmentStatus } from "@/types";
import { format } from 'date-fns';
import { medicalEquipmentList } from "@/lib/equipmentList";
import { MoreHorizontal } from "lucide-react";

const statusClasses: Record<BiomedicalEquipmentStatus, string> = {
  opérationnel: "bg-green-500",
  en_maintenance: "bg-yellow-500",
  hors_service: "bg-red-500",
};

interface EquipmentListProps {
  equipment: BiomedicalEquipment[];
  onUpdateStatus: (equipmentId: string, status: BiomedicalEquipmentStatus) => void;
}

// Crée une map pour trouver la catégorie d'un équipement par son nom
const equipmentCategoryMap = new Map<string, string>();
medicalEquipmentList.forEach(category => {
  category.options.forEach(equipmentName => {
    equipmentCategoryMap.set(equipmentName, category.label);
  });
});

// Fonction pour déterminer la catégorie, même avec des noms partiels
const getEquipmentCategory = (equipmentName: string) => {
  if (equipmentCategoryMap.has(equipmentName)) {
    return equipmentCategoryMap.get(equipmentName)!;
  }
  for (const [key, value] of equipmentCategoryMap.entries()) {
    const mainKey = key.split('(')[0].trim();
    if (equipmentName.startsWith(mainKey) || mainKey.startsWith(equipmentName)) {
      return value;
    }
  }
  return 'Autres Équipements';
};

export const EquipmentList = ({ equipment, onUpdateStatus }: EquipmentListProps) => {
  // Regroupe les équipements par catégorie
  const groupedEquipment = equipment.reduce((acc, item) => {
    const category = getEquipmentCategory(item.name);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, BiomedicalEquipment[]>);

  // Trie les catégories pour qu'elles apparaissent dans un ordre logique
  const sortedCategories = Object.keys(groupedEquipment).sort((a, b) => {
    const indexA = medicalEquipmentList.findIndex(cat => cat.label === a);
    const indexB = medicalEquipmentList.findIndex(cat => cat.label === b);
    if (a === 'Autres Équipements') return 1;
    if (b === 'Autres Équipements') return -1;
    return indexA - indexB;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="ListChecks" className="text-blue-600 mr-2" />
          Recensement des Équipements Biomédicaux
        </CardTitle>
      </CardHeader>
      <CardContent>
        {equipment.length > 0 ? (
          <Accordion type="single" collapsible className="w-full" defaultValue={sortedCategories[0]}>
            {sortedCategories.map(category => {
              const items = groupedEquipment[category];
              return (
                <AccordionItem value={category} key={category}>
                  <AccordionTrigger className="text-lg font-medium hover:no-underline">
                    {category} ({items.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>N° de Série</TableHead>
                          <TableHead>Localisation</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Prochaine Maintenance</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.serial_number}</TableCell>
                            <TableCell>{item.location}</TableCell>
                            <TableCell>
                              <Badge className={`${statusClasses[item.status]} hover:${statusClasses[item.status]}`}>{item.status}</Badge>
                            </TableCell>
                            <TableCell>{item.next_maintenance ? format(item.next_maintenance, 'dd/MM/yyyy') : 'N/A'}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => onUpdateStatus(item.id, 'en_maintenance')} disabled={item.status === 'en_maintenance'}>
                                    Mettre en maintenance
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onUpdateStatus(item.id, 'hors_service')} disabled={item.status === 'hors_service'}>
                                    Mettre hors service
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onUpdateStatus(item.id, 'opérationnel')} disabled={item.status === 'opérationnel'}>
                                    Rendre opérationnel
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Icon name="ListChecks" className="mx-auto h-12 w-12 text-gray-300 mb-2" />
            Aucun équipement biomédical n'a été ajouté.
          </div>
        )}
      </CardContent>
    </Card>
  );
};