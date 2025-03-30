const cron = require('node-cron');
const notificationService = require('./NotificationService');
const backupService = require('./BackupService');
const monitoringService = require('./MonitoringService');

class SchedulerService {
  constructor() {
    // Check for expiring domains and hosting daily at 9 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('Running daily expiry checks...');
      await this.runDailyChecks();
    });

    // Create database backup daily at 1 AM
    cron.schedule('0 1 * * *', async () => {
      console.log('Running daily backup...');
      await this.runDailyBackup();
    });

    // Monitor websites every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      console.log('Running website monitoring...');
      await this.runMonitoring();
    });
  }

  async runDailyChecks() {
    try {
      // Check for expiring domains
      await notificationService.checkExpiringDomains();
      
      // Check for expiring hosting
      await notificationService.checkExpiringHosting();
      
      console.log('Daily checks completed successfully');
    } catch (error) {
      console.error('Error running daily checks:', error);
      
      // Send critical alert to administrators
      await notificationService.sendCriticalAlert(
        'Daily Checks Failed',
        `Error running daily expiry checks: ${error.message}`,
        [process.env.ADMIN_EMAIL]
      );
    }
  }

  async runDailyBackup() {
    try {
      await backupService.createBackup();
      console.log('Daily backup completed successfully');
    } catch (error) {
      console.error('Error running daily backup:', error);
      
      // Send critical alert to administrators
      await notificationService.sendCriticalAlert(
        'Daily Backup Failed',
        `Error running daily backup: ${error.message}`,
        [process.env.ADMIN_EMAIL]
      );
    }
  }

  async runMonitoring() {
    try {
      await monitoringService.monitorAllWebsites();
      console.log('Website monitoring completed successfully');
    } catch (error) {
      console.error('Error running website monitoring:', error);
      
      // Send critical alert to administrators
      await notificationService.sendCriticalAlert(
        'Monitoring Failed',
        `Error running website monitoring: ${error.message}`,
        [process.env.ADMIN_EMAIL]
      );
    }
  }

  // Method to manually trigger checks
  async runChecksNow() {
    console.log('Manually triggering expiry checks...');
    await this.runDailyChecks();
  }

  // Method to manually trigger backup
  async runBackupNow() {
    console.log('Manually triggering backup...');
    await this.runDailyBackup();
  }

  // Method to manually trigger monitoring
  async runMonitoringNow() {
    console.log('Manually triggering website monitoring...');
    await this.runMonitoring();
  }
}

module.exports = new SchedulerService(); 