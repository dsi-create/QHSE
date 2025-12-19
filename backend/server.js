const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Import middlewares de validation
const {
  validateSignup,
  validateSignin,
  validatePasswordUpdate,
  validateIncident,
  validateVisitor,
  rateLimitLogin,
  requestLogger,
  loginAttempts
} = require('./middlewares/validation');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use(requestLogger);

// Servir les fichiers statiques (images)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Configuration MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hospital_management',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Pool de connexions MySQL
const pool = mysql.createPool(dbConfig);

// Configuration Multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(uploadsDir, 'incident_photos');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'));
    }
  }
});

// Middleware d'authentification
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [users] = await pool.execute(
      'SELECT * FROM profiles WHERE id = ?',
      [decoded.userId]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

// Routes d'authentification
app.post('/api/auth/signup', validateSignup, async (req, res) => {
  try {
    const { email, password, first_name, last_name, username, role, service, civility, pin } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const [existing] = await pool.execute(
      'SELECT * FROM profiles WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email ou nom d\'utilisateur déjà utilisé' });
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuidv4();

    // Créer l'utilisateur
    await pool.execute(
      `INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service, pin)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, username, email, passwordHash, first_name, last_name, civility || 'M.', role, service || '', pin || null]
    );

    // Générer un token JWT
    const token = jwt.sign({ userId: id, email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: { id, email, username },
      token
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/auth/signin', rateLimitLogin, validateSignin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.execute(
      'SELECT * FROM profiles WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Réinitialiser le compteur de tentatives en cas de succès
    if (req.rateLimitKey) {
      loginAttempts.delete(req.rateLimitKey);
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      },
      token
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/auth/signout', authenticateToken, (req, res) => {
  res.json({ message: 'Déconnexion réussie' });
});

app.put('/api/auth/password', authenticateToken, validatePasswordUpdate, async (req, res) => {
  try {
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    await pool.execute(
      'UPDATE profiles SET password_hash = ? WHERE id = ?',
      [passwordHash, req.user.id]
    );

    res.json({ message: 'Mot de passe mis à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les profils
app.get('/api/profiles', authenticateToken, async (req, res) => {
  try {
    const [profiles] = await pool.execute(
      'SELECT id, username, email, first_name, last_name, civility, role, service, pin, added_permissions, removed_permissions, created_at FROM profiles'
    );
    res.json(profiles);
  } catch (error) {
    console.error('Erreur lors de la récupération des profils:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/profiles/:id', authenticateToken, async (req, res) => {
  try {
    const [profiles] = await pool.execute(
      'SELECT id, username, email, first_name, last_name, civility, role, service, pin, added_permissions, removed_permissions FROM profiles WHERE id = ?',
      [req.params.id]
    );
    if (profiles.length === 0) {
      return res.status(404).json({ error: 'Profil non trouvé' });
    }
    res.json(profiles[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/profiles/:id', authenticateToken, async (req, res) => {
  try {
    const { added_permissions, removed_permissions } = req.body;
    await pool.execute(
      'UPDATE profiles SET added_permissions = ?, removed_permissions = ? WHERE id = ?',
      [JSON.stringify(added_permissions || []), JSON.stringify(removed_permissions || []), req.params.id]
    );
    res.json({ message: 'Profil mis à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/profiles/:id', authenticateToken, async (req, res) => {
  try {
    // Seul le superadmin peut supprimer des utilisateurs
    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    await pool.execute('DELETE FROM profiles WHERE id = ?', [req.params.id]);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les incidents
app.get('/api/incidents', authenticateToken, async (req, res) => {
  try {
    const [incidents] = await pool.execute(
      'SELECT * FROM incidents ORDER BY date_creation DESC'
    );
    res.json(incidents.map(inc => ({
      ...inc,
      photo_urls: inc.photo_urls ? JSON.parse(inc.photo_urls) : [],
      report: inc.report ? JSON.parse(inc.report) : null
    })));
  } catch (error) {
    console.error('Erreur lors de la récupération des incidents:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/incidents', authenticateToken, validateIncident, async (req, res) => {
  try {
    const { type, description, priorite, service, lieu, photo_urls } = req.body;
    const id = uuidv4();

    await pool.execute(
      `INSERT INTO incidents (id, type, description, reported_by, statut, priorite, service, lieu, photo_urls)
       VALUES (?, ?, ?, ?, 'nouveau', ?, ?, ?, ?)`,
      [id, type, description, req.user.id, priorite, service, lieu, JSON.stringify(photo_urls || [])]
    );

    res.json({ id, message: 'Incident créé' });
  } catch (error) {
    console.error('Erreur lors de la création de l\'incident:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/incidents/:id', authenticateToken, async (req, res) => {
  try {
    const { statut, assigned_to, priorite, deadline, report } = req.body;
    
    // Récupérer l'incident existant pour vérifier les permissions
    const [incidents] = await pool.execute('SELECT * FROM incidents WHERE id = ?', [req.params.id]);
    if (incidents.length === 0) {
      return res.status(404).json({ error: 'Incident non trouvé' });
    }
    const incident = incidents[0];

    // Si on essaie d'assigner ou de modifier la priorité/déadline, seul le superviseur QHSE peut le faire
    // (sauf si c'est juste une mise à jour de statut par l'assigné lui-même)
    if (assigned_to !== undefined || priorite !== undefined || deadline !== undefined) {
      const isStatusUpdateOnly = statut !== undefined && 
                                  assigned_to === undefined && 
                                  priorite === undefined && 
                                  deadline === undefined &&
                                  report === undefined;
      
      // Si ce n'est pas juste une mise à jour de statut, ou si on essaie d'assigner, vérifier les permissions
      if (!isStatusUpdateOnly || assigned_to !== undefined) {
        if (req.user.role !== 'superviseur_qhse' && req.user.role !== 'superadmin') {
          return res.status(403).json({ error: 'Seul le superviseur QHSE peut assigner ou planifier des interventions' });
        }
      }
    }

    const updates = [];
    const values = [];

    if (statut !== undefined) {
      updates.push('statut = ?');
      values.push(statut);
    }
    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      values.push(assigned_to);
    }
    if (priorite !== undefined) {
      updates.push('priorite = ?');
      values.push(priorite);
    }
    if (deadline !== undefined) {
      updates.push('deadline = ?');
      values.push(deadline);
    }
    if (report !== undefined) {
      updates.push('report = ?');
      values.push(JSON.stringify(report));
    }

    values.push(req.params.id);
    await pool.execute(
      `UPDATE incidents SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'Incident mis à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'incident:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Upload d'images pour les incidents
app.post('/api/incidents/upload-images', authenticateToken, upload.array('images', 10), (req, res) => {
  try {
    const urls = req.files.map(file => {
      return `${process.env.UPLOAD_BASE_URL || 'http://localhost:3001/uploads'}/incident_photos/${file.filename}`;
    });
    res.json({ urls });
  } catch (error) {
    console.error('Erreur lors de l\'upload des images:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les visiteurs
app.get('/api/visitors', authenticateToken, async (req, res) => {
  try {
    const [visitors] = await pool.execute(
      'SELECT * FROM visitors ORDER BY entry_time DESC'
    );
    res.json(visitors);
  } catch (error) {
    console.error('Erreur lors de la récupération des visiteurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/visitors', authenticateToken, validateVisitor, async (req, res) => {
  try {
    const { full_name, id_document, reason, destination, person_to_see } = req.body;
    const id = uuidv4();

    await pool.execute(
      `INSERT INTO visitors (id, full_name, id_document, reason, destination, person_to_see, registered_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, full_name, id_document, reason, destination, person_to_see, req.user.id]
    );

    res.json({ id, message: 'Visiteur enregistré' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du visiteur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/visitors/:id/signout', authenticateToken, async (req, res) => {
  try {
    await pool.execute(
      'UPDATE visitors SET exit_time = NOW() WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Sortie enregistrée' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la sortie:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les équipements biomédicaux
app.get('/api/biomedical-equipment', authenticateToken, async (req, res) => {
  try {
    const [equipment] = await pool.execute('SELECT * FROM biomedical_equipment');
    res.json(equipment);
  } catch (error) {
    console.error('Erreur lors de la récupération des équipements:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/biomedical-equipment', authenticateToken, async (req, res) => {
  try {
    const { name, serial_number, location, model, department } = req.body;
    const id = uuidv4();
    const nextMaintenance = new Date();
    nextMaintenance.setMonth(nextMaintenance.getMonth() + 6);

    await pool.execute(
      `INSERT INTO biomedical_equipment (id, name, model, serial_number, department, location, status, last_maintenance, next_maintenance)
       VALUES (?, ?, ?, ?, ?, ?, 'opérationnel', NOW(), ?)`,
      [id, name, model || 'N/A', serial_number, department || 'N/A', location, nextMaintenance]
    );

    res.json({ id, message: 'Équipement ajouté' });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'équipement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/biomedical-equipment/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.execute('UPDATE biomedical_equipment SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Statut mis à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les tâches de maintenance
app.get('/api/maintenance-tasks', authenticateToken, async (req, res) => {
  try {
    const [tasks] = await pool.execute('SELECT * FROM maintenance_tasks ORDER BY scheduled_date');
    res.json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/maintenance-tasks', authenticateToken, async (req, res) => {
  try {
    const { equipment_id, type, description, technician_id, scheduled_date } = req.body;
    const id = uuidv4();

    await pool.execute(
      `INSERT INTO maintenance_tasks (id, equipment_id, type, description, technician_id, scheduled_date, status)
       VALUES (?, ?, ?, ?, ?, ?, 'planifiée')`,
      [id, equipment_id, type, description, technician_id, scheduled_date]
    );

    res.json({ id, message: 'Tâche planifiée' });
  } catch (error) {
    console.error('Erreur lors de la planification de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les salles
app.get('/api/rooms', authenticateToken, async (req, res) => {
  try {
    const [rooms] = await pool.execute('SELECT * FROM rooms');
    res.json(rooms);
  } catch (error) {
    console.error('Erreur lors de la récupération des salles:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les médecins
app.get('/api/doctors', authenticateToken, async (req, res) => {
  try {
    const [doctors] = await pool.execute('SELECT * FROM doctors');
    res.json(doctors);
  } catch (error) {
    console.error('Erreur lors de la récupération des médecins:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les réservations
app.get('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const [bookings] = await pool.execute('SELECT * FROM bookings ORDER BY start_time');
    res.json(bookings);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    // Seule la secrétaire peut créer des réservations
    if (req.user.role !== 'secretaire') {
      return res.status(403).json({ error: 'Seule la secrétaire peut créer des réservations' });
    }

    const { room_id, title, start_time, end_time, doctor_id } = req.body;
    const id = uuidv4();

    await pool.execute(
      `INSERT INTO bookings (id, room_id, title, booked_by, start_time, end_time, doctor_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'réservé')`,
      [id, room_id, title, req.user.id, start_time, end_time, doctor_id || null]
    );

    res.json({ id, message: 'Réservation créée' });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    const { room_id, title, start_time, end_time, doctor_id, status } = req.body;
    
    // Récupérer la réservation existante
    const [bookings] = await pool.execute('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
    if (bookings.length === 0) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    const booking = bookings[0];

    // Si c'est seulement une mise à jour du statut (démarrer/terminer), vérifier si c'est le médecin assigné
    // Comparer les dates correctement en convertissant en ISO string
    const existingStartTime = booking.start_time instanceof Date 
      ? booking.start_time.toISOString() 
      : new Date(booking.start_time).toISOString();
    const existingEndTime = booking.end_time instanceof Date 
      ? booking.end_time.toISOString() 
      : new Date(booking.end_time).toISOString();

    const isStatusOnlyUpdate = status && 
      (status === 'en_cours' || status === 'terminé') &&
      (!room_id || room_id === booking.room_id) &&
      (!title || title === booking.title) &&
      (!start_time || start_time === existingStartTime) &&
      (!end_time || end_time === existingEndTime) &&
      (!doctor_id || doctor_id === booking.doctor_id);

    if (isStatusOnlyUpdate) {
      // Permettre au médecin assigné de démarrer/terminer sa consultation
      // Vérifier que le médecin est assigné à cette réservation
      if (req.user.role === 'medecin' && booking.doctor_id && booking.doctor_id === req.user.id) {
        await pool.execute(
          `UPDATE bookings SET status = ? WHERE id = ?`,
          [status, req.params.id]
        );
        return res.json({ message: 'Réservation mise à jour' });
      }
    }

    // Pour toutes les autres modifications, seule la secrétaire peut modifier
    if (req.user.role !== 'secretaire') {
      return res.status(403).json({ error: 'Seule la secrétaire peut modifier des réservations' });
    }

    await pool.execute(
      `UPDATE bookings SET room_id = ?, title = ?, start_time = ?, end_time = ?, doctor_id = ?, status = ? WHERE id = ?`,
      [room_id, title, start_time, end_time, doctor_id || null, status, req.params.id]
    );
    res.json({ message: 'Réservation mise à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/bookings/:id', authenticateToken, async (req, res) => {
  try {
    // Seule la secrétaire peut supprimer des réservations
    if (req.user.role !== 'secretaire') {
      return res.status(403).json({ error: 'Seule la secrétaire peut annuler des réservations' });
    }

    await pool.execute('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ message: 'Réservation supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les tâches planifiées
app.get('/api/planned-tasks', authenticateToken, async (req, res) => {
  try {
    const [tasks] = await pool.execute(
      'SELECT * FROM planned_tasks ORDER BY created_at DESC'
    );
    res.json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches planifiées:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/planned-tasks', authenticateToken, async (req, res) => {
  try {
    // Seul le superviseur QHSE peut créer des tâches planifiées
    if (req.user.role !== 'superviseur_qhse' && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Seul le superviseur QHSE peut créer des tâches planifiées' });
    }

    const { title, description, assigned_to, due_date } = req.body;
    const id = uuidv4();

    await pool.execute(
      `INSERT INTO planned_tasks (id, title, description, assigned_to, created_by, due_date, status)
       VALUES (?, ?, ?, ?, ?, ?, 'à faire')`,
      [id, title, description, assigned_to, req.user.id, due_date]
    );

    res.json({ id, message: 'Tâche créée' });
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/planned-tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.execute('UPDATE planned_tasks SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Tâche mise à jour' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/planned-tasks/:id', authenticateToken, async (req, res) => {
  try {
    await pool.execute('DELETE FROM planned_tasks WHERE id = ?', [req.params.id]);
    res.json({ message: 'Tâche supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les notifications
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const [notifications] = await pool.execute(
      'SELECT * FROM notifications WHERE recipient_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(notifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { recipient_id, message, link } = req.body;
    const id = uuidv4();

    await pool.execute(
      `INSERT INTO notifications (id, recipient_id, message, link, read)
       VALUES (?, ?, ?, ?, FALSE)`,
      [id, recipient_id, message, link || null]
    );

    res.json({ id, message: 'Notification créée' });
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/notifications/mark-read', authenticateToken, async (req, res) => {
  try {
    await pool.execute(
      'UPDATE notifications SET read = TRUE WHERE recipient_id = ? AND read = FALSE',
      [req.user.id]
    );
    res.json({ message: 'Notifications marquées comme lues' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour vérifier que le superadmin existe
app.post('/api/ensure-superadmin', async (req, res) => {
  try {
    const [admins] = await pool.execute(
      "SELECT * FROM profiles WHERE role = 'superadmin'"
    );

    if (admins.length === 0) {
      // Créer un superadmin par défaut
      const id = uuidv4();
      const passwordHash = await bcrypt.hash('admin123', 10);

      await pool.execute(
        `INSERT INTO profiles (id, username, email, password_hash, first_name, last_name, civility, role, service)
         VALUES (?, 'superadmin', 'admin@hospital.com', ?, 'Super', 'Admin', 'M.', 'superadmin', 'Administration')`,
        [id, passwordHash]
      );

      res.json({ success: true, message: 'Superadmin créé' });
    } else {
      res.json({ success: true, message: 'Superadmin existe déjà' });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du superadmin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes QHSE (nouveaux modules)
const qhseRoutes = require('./routes/qhse')(pool, authenticateToken, dbConfig.database);
app.use('/api/qhse', qhseRoutes);

// Middleware de gestion d'erreurs globale
app.use((err, req, res, next) => {
  console.error('Erreur:', err);

  // Erreur Multer (upload)
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Le fichier est trop volumineux (max 10MB)' });
    }
    return res.status(400).json({ error: 'Erreur lors de l\'upload du fichier' });
  }

  // Erreur de validation
  if (err.status === 400) {
    return res.status(400).json({ error: err.message || 'Données invalides' });
  }

  // Erreur d'authentification
  if (err.status === 401 || err.status === 403) {
    return res.status(err.status).json({ error: err.message || 'Accès non autorisé' });
  }

  // Erreur serveur
  res.status(500).json({ error: 'Erreur serveur interne' });
});

// Démarrage du serveur
app.listen(PORT, async () => {
  console.log(`✅ Serveur API démarré sur le port ${PORT}`);
  console.log(`📊 Base de données: ${dbConfig.database} sur ${dbConfig.host}:${dbConfig.port}`);
  console.log(`📦 Modules QHSE chargés: GED, Audits, Formations, Déchets, Stérilisation, Risques`);
  
  // Test de connexion à la base de données
  try {
    const [result] = await pool.execute('SELECT COUNT(*) as count FROM profiles');
    console.log(`✅ Connexion MySQL réussie! ${result[0].count} utilisateur(s) trouvé(s)`);
  } catch (error) {
    console.error(`❌ Erreur de connexion à MySQL: ${error.message}`);
    console.error('💡 Vérifiez votre configuration dans backend/.env');
  }
});


