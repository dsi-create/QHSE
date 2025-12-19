import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Booking, Room, User } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const createReportHTML = (bookings: Booking[], rooms: Room[], users: { [username: string]: User }, selectedDate: Date): HTMLDivElement => {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.color = '#333';

  let html = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="font-size: 24px; margin: 0;">Rapport des Réservations</h1>
      <p style="font-size: 16px; margin: 5px 0;">Date: ${format(selectedDate, 'PPP', { locale: fr })}</p>
    </div>
  `;

  if (bookings.length === 0) {
    html += '<p style="text-align: center; margin-top: 30px;">Aucune réservation pour cette date.</p>';
  } else {
    html += `
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead style="background-color: #f2f2f2;">
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Heure</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Salle</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Objet</th>
            <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Réservé par</th>
          </tr>
        </thead>
        <tbody>
          ${bookings.sort((a, b) => a.start_time.getTime() - b.start_time.getTime()).map(booking => {
            const room = rooms.find(r => r.id === booking.room_id);
            const user = Object.values(users).find(u => u.id === booking.booked_by); // Find user by ID
            return `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${format(booking.start_time, 'HH:mm')} - ${format(booking.end_time, 'HH:mm')}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${room?.name || 'Inconnue'}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${booking.title}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${user?.first_name} ${user?.last_name || 'Inconnu'}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;
  }

  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
};

export const generateBookingReportPDF = async (bookings: Booking[], rooms: Room[], users: { [username: string]: User }, selectedDate: Date) => {
  const reportElement = createReportHTML(bookings, rooms, users, selectedDate);

  const canvas = await html2canvas(reportElement, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`rapport-reservations-${format(selectedDate, 'yyyy-MM-dd')}.pdf`);

  document.body.removeChild(reportElement);
};