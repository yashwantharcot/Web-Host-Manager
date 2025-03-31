const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { Sequelize } = require('sequelize');
const notificationService = require('./NotificationService');

class BackupService {
  constructor() {
    this.backupDir = process.env.BACKUP_DIR || path.join(__dirname, '../../backups');
    this.maxBackups = process.env.MAX_BACKUPS || 7; // Keep a week's worth of backups
  }

  async createBackup() {
    try {
      // Ensure backup directory exists
      await fs.mkdir(this.backupDir, { recursive: true });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `backup-${timestamp}.sql`;
      const filePath = path.join(this.backupDir, filename);

      // Create backup using pg_dump
      const command = `pg_dump -U ${process.env.DB_USER} -h ${process.env.DB_HOST} ${process.env.DB_NAME} > ${filePath}`;
      
      await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout);
        });
      });

      // Verify backup
      const isValid = await this.verifyBackup(filePath);
      
      if (!isValid) {
        throw new Error('Backup verification failed');
      }

      // Clean up old backups
      await this.cleanupOldBackups();

      console.log(`Backup created successfully: ${filename}`);
      return filePath;
    } catch (error) {
      console.error('Error creating backup:', error);
      
      // Send critical alert
      await notificationService.sendCriticalAlert(
        'Backup Creation Failed',
        `Error creating database backup: ${error.message}`,
        [process.env.ADMIN_EMAIL]
      );
      
      throw error;
    }
  }

  async verifyBackup(backupPath) {
    try {
      // Read the backup file
      const backupContent = await fs.readFile(backupPath, 'utf8');
      
      // Basic verification checks
      if (!backupContent || backupContent.length === 0) {
        throw new Error('Backup file is empty');
      }

      // Check if the backup contains essential table definitions
      const requiredTables = ['clients', 'websites', 'domains', 'email_accounts'];
      const hasAllTables = requiredTables.every(table => 
        backupContent.includes(`CREATE TABLE ${table}`)
      );

      if (!hasAllTables) {
        throw new Error('Backup is missing essential table definitions');
      }

      // Create a temporary database for verification
      const verifyDb = `verify_${Date.now()}`;
      const sequelize = new Sequelize({
        database: verifyDb,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
      });

      // Restore backup to temporary database
      await sequelize.query(`CREATE DATABASE ${verifyDb}`);
      
      const restoreCommand = `psql -U ${process.env.DB_USER} -h ${process.env.DB_HOST} ${verifyDb} < ${backupPath}`;
      await new Promise((resolve, reject) => {
        exec(restoreCommand, (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout);
        });
      });

      // Verify data integrity
      for (const table of requiredTables) {
        const [result] = await sequelize.query(`SELECT COUNT(*) FROM ${table}`);
        if (!result || !result[0] || result[0].count === undefined) {
          throw new Error(`Failed to verify table: ${table}`);
        }
      }

      // Clean up temporary database
      await sequelize.query(`DROP DATABASE ${verifyDb}`);
      await sequelize.close();

      return true;
    } catch (error) {
      console.error('Backup verification failed:', error);
      return false;
    }
  }

  async cleanupOldBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const backupFiles = files
        .filter(file => file.startsWith('backup-') && file.endsWith('.sql'))
        .sort()
        .reverse();

      // Keep only the most recent backups
      if (backupFiles.length > this.maxBackups) {
        const filesToDelete = backupFiles.slice(this.maxBackups);
        for (const file of filesToDelete) {
          await fs.unlink(path.join(this.backupDir, file));
          console.log(`Deleted old backup: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old backups:', error);
    }
  }

  async restoreBackup(backupPath) {
    try {
      // Verify backup before restoration
      const isValid = await this.verifyBackup(backupPath);
      if (!isValid) {
        throw new Error('Backup verification failed, aborting restoration');
      }

      // Restore backup
      const command = `psql -U ${process.env.DB_USER} -h ${process.env.DB_HOST} ${process.env.DB_NAME} < ${backupPath}`;
      
      await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(stdout);
        });
      });

      console.log(`Backup restored successfully from: ${backupPath}`);
    } catch (error) {
      console.error('Error restoring backup:', error);
      
      // Send critical alert
      await notificationService.sendCriticalAlert(
        'Backup Restoration Failed',
        `Error restoring database backup: ${error.message}`,
        [process.env.ADMIN_EMAIL]
      );
      
      throw error;
    }
  }
}

module.exports = new BackupService(); 