/**
 * Email Service
 * Converted from config/mail_service.php
 * Nodemailer-based email service with SMTP support
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = null;
        this.setupTransporter();
    }

    setupTransporter() {
        try {
            const provider = process.env.EMAIL_PROVIDER || 'smtp';

            let config = {};

            if (provider === 'sendgrid') {
                config = {
                    host: 'smtp.sendgrid.net',
                    port: 587,
                    secure: false,
                    auth: {
                        user: 'apikey',
                        pass: process.env.SENDGRID_API_KEY
                    }
                };
            } else {
                // Default: Gmail SMTP
                config = {
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false, // Use TLS
                    auth: {
                        user: process.env.SMTP_USERNAME,
                        pass: process.env.SMTP_PASSWORD
                    }
                };
            }

            this.transporter = nodemailer.createTransport(config);

            logger.info(`Email service configured with provider: ${provider}`);
        } catch (error) {
            logger.error('Email service setup failed:', { error: error.message });
        }
    }

    /**
     * Send email
     */
    async sendMail(to, subject, htmlBody, altBody = '') {
        try {
            if (!this.transporter) {
                throw new Error('Email transporter not configured');
            }

            const mailOptions = {
                from: {
                    name: 'Liminara',
                    address: process.env.SMTP_USERNAME || 'noreply@liminara.com'
                },
                to: to,
                subject: subject,
                html: htmlBody,
                text: altBody || htmlBody.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
            };

            const info = await this.transporter.sendMail(mailOptions);

            logger.success(`Email sent successfully to: ${to} - Subject: ${subject}`, {
                messageId: info.messageId
            });

            return {
                success: true,
                message: 'Email sent successfully',
                recipient: to,
                messageId: info.messageId
            };
        } catch (error) {
            logger.error(`Email failed to: ${to}`, { error: error.message });

            return {
                success: false,
                message: 'Email sending failed',
                error: error.message,
                recipient: to
            };
        }
    }

    /**
     * Send dual emails (user + admin)
     */
    async sendDualEmails(userEmail, adminEmail) {
        const results = {
            userEmail: await this.sendMail(userEmail.to, userEmail.subject, userEmail.body),
            adminEmail: await this.sendMail(adminEmail.to, adminEmail.subject, adminEmail.body)
        };

        logger.info(`Dual emails sent - User: ${userEmail.to}, Admin: ${adminEmail.to}`);

        return results;
    }

    /**
     * Verify transporter configuration
     */
    async verifyConnection() {
        try {
            if (!this.transporter) {
                return false;
            }
            await this.transporter.verify();
            return true;
        } catch (error) {
            logger.error('Email service verification failed:', { error: error.message });
            return false;
        }
    }
}

// Singleton instance
const emailService = new EmailService();

module.exports = emailService;
