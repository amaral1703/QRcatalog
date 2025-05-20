const { sequelize } = require('../models');  // Ajuste para subir apenas um nível

(async () => {
  try {
    console.log('Dropping all tables...');
    await sequelize.drop();
    console.log('All tables dropped!');
    
    console.log('Syncing database...');
    await sequelize.sync();
    console.log('Database synced successfully!');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
})();