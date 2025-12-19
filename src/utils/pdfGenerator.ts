import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Incident } from '@/types';
import { format } from 'date-fns';

const createReportHTML = (incidents: Incident[]): HTMLDivElement => {
  const today = new Date();
  const dailyIncidents = incidents.filter(i => new Date(i.date_creation).toDateString() === today.toDateString());

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.color = '#333';

  let html = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="font-size: 24px; margin: 0;">Rapport Journalier des Incidents</h1>
      <p style="font-size: 16px; margin: 5px 0;">Date: ${format(today, 'dd/MM/yyyy')}</p>
    </div>
  `;

  const renderTable = (title: string, data: Incident[]) => {
    if (data.length === 0) return '';
    let tableHtml = `<h2 style="font-size: 18px; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 20px;">${title} (${data.length})</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead style="background-color: #f2f2f2;">
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Heure</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Type</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Lieu</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Agent</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(i => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${format(i.date_creation, 'HH:mm')}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${i.type}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${i.reported_by}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
    return tableHtml;
  };

  html += renderTable('Nouveaux Incidents', dailyIncidents.filter(i => i.statut === 'nouveau'));
  html += renderTable('Incidents en Cours', dailyIncidents.filter(i => i.statut === 'cours'));
  html += renderTable('Incidents Résolus Aujourd\'hui', dailyIncidents.filter(i => i.statut === 'resolu'));

  if (dailyIncidents.length === 0) {
    html += '<p style="text-align: center; margin-top: 30px;">Aucun incident à signaler pour aujourd\'hui.</p>';
  }

  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
};

export const generateDailyReportPDF = async (incidents: Incident[]) => {
  const reportElement = createReportHTML(incidents);

  const canvas = await html2canvas(reportElement, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`rapport-journalier-${format(new Date(), 'yyyy-MM-dd')}.pdf`);

  document.body.removeChild(reportElement);
};