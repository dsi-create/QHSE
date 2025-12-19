// Script de test de connexion à la base de données
// Exécutez avec: node test-db-connection.js

require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hospital_management',
  port: process.env.DB_PORT || 3306,
};

async function testConnection() {
  console.log('🔍 Test de connexion à la base de données...\n');
  console.log('Configuration:');
  console.log(`  Host: ${dbConfig.host}`);
  console.log(`  User: ${dbConfig.user}`);
  console.log(`  Database: ${dbConfig.database}`);
  console.log(`  Port: ${dbConfig.port}\n`);

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion réussie à MySQL!\n');

    // Vérifier les tables
    console.log('📊 Vérification des tables...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`✅ ${tables.length} table(s) trouvée(s):`);
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });
    console.log('');

    // Vérifier les utilisateurs
    console.log('👥 Vérification des utilisateurs...');
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM profiles');
    console.log(`✅ ${users[0].count} utilisateur(s) trouvé(s)`);
    
    const [userList] = await connection.execute(
      'SELECT username, email, role FROM profiles ORDER BY role'
    );
    console.log('\nUtilisateurs:');
    userList.forEach(user => {
      console.log(`   - ${user.username} (${user.email}) - ${user.role}`);
    });
    console.log('');

    // Vérifier les ENUMs
    console.log('🔍 Vérification des ENUMs de la table incidents...');
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM incidents WHERE Field IN ('statut', 'priorite')"
    );
    columns.forEach(col => {
      console.log(`   ${col.Field}: ${col.Type}`);
    });
    console.log('');

    await connection.end();
    console.log('✅ Tous les tests sont passés avec succès!');
    console.log('🚀 Votre base de données est prête à être utilisée!');
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('\n💡 Solutions possibles:');
    console.error('   1. Vérifiez que MySQL est démarré (WAMP/XAMPP)');
    console.error('   2. Vérifiez les paramètres dans backend/.env');
    console.error('   3. Vérifiez que la base "hospital_management" existe');
    console.error('   4. Exécutez database/schema.sql pour créer la base');
    process.exit(1);
  }
}

testConnection();



