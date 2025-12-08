/**
 * OTP Service
 * Handles OTP generation, storage, verification, and delivery
 */

const crypto = require('crypto');
const jsonDB = require('./json-db.service');
const emailService = require('./email.service');
const SmsService = require('./sms.service');
const logger = require('../utils/logger');

class OTPService {
    constructor() {
        this.OTP_LENGTH = 6;
        this.OTP_EXPIRY_MINUTES = 5;
        this.MAX_ATTEMPTS = 3;
    }

    /**
     * Generate 6-digit OTP
     */
    generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    }

    /**
     * Store OTP with expiry
     */
    async storeOTP(identifier, method) {
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

        const otpData = {
            otp,
            method, // 'phone' or 'email'
            expiresAt: expiresAt.toISOString(),
            verified: false,
            attempts: 0,
            createdAt: new Date().toISOString()
        };

        await jsonDB.set('otps.json', identifier, otpData);

        logger.info(`OTP generated for ${identifier} via ${method}`);

        return otp;
    }

    /**
     * Send OTP via SMS or Email
     */
    async sendOTP(identifier, method, otp, userName = 'Customer') {
        try {
            if (method === 'phone') {
                // Send via SMS
                const smsService = new SmsService();
                const smsMessage = `Your Liminara OTP is: ${otp}. Valid for ${this.OTP_EXPIRY_MINUTES} minutes. Do not share this code.`;
                
                const result = await smsService.sendSms(identifier, smsMessage);
                
                if (!result.success) {
                    throw new Error(result.error || 'Failed to send SMS');
                }
                
                logger.success(`OTP sent via SMS to ${identifier}`);
            } else if (method === 'email') {
                // Send via Email
                const htmlBody = `
          <h2>Your OTP Code</h2>
          <p>Dear ${userName},</p>
          <p>Your One-Time Password (OTP) for login is:</p>
          <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in ${this.OTP_EXPIRY_MINUTES} minutes.</p>
          <p><strong>Do not share this code with anyone.</strong></p>
          <p>If you didn't request this code, please ignore this email.</p>
          <br>
          <p>Best regards,<br>Liminara Team</p>
        `;

                const result = await emailService.sendMail(
                    identifier,
                    'Your OTP Code - Liminara',
                    htmlBody
                );
                
                if (!result.success) {
                    throw new Error(result.error || 'Failed to send email');
                }
                
                logger.success(`OTP sent via email to ${identifier}`);
            } else {
                throw new Error('Invalid OTP method');
            }

            return true;
        } catch (error) {
            logger.error('OTP sending failed:', { error: error.message });
            throw new Error('Failed to send OTP: ' + error.message);
        }
    }

    /**
     * Request OTP (generate and send)
     */
    async requestOTP(identifier, method, userName) {
        const otp = await this.storeOTP(identifier, method);
        await this.sendOTP(identifier, method, otp, userName);

        return {
            success: true,
            expiresIn: this.OTP_EXPIRY_MINUTES * 60 // seconds
        };
    }

    /**
     * Verify OTP
     */
    async verifyOTP(identifier, otpCode) {
        const storedData = await jsonDB.get('otps.json', identifier);

        if (!storedData) {
            return {
                success: false,
                message: 'OTP not found. Please request a new one.'
            };
        }

        // Check expiry
        if (new Date(storedData.expiresAt) < new Date()) {
            await jsonDB.delete('otps.json', identifier);
            return {
                success: false,
                message: 'OTP has expired. Please request a new one.'
            };
        }

        // Check attempts
        if (storedData.attempts >= this.MAX_ATTEMPTS) {
            await jsonDB.delete('otps.json', identifier);
            return {
                success: false,
                message: 'Maximum attempts exceeded. Please request a new OTP.'
            };
        }

        // Verify OTP
        if (storedData.otp !== otpCode) {
            // Increment attempts
            storedData.attempts += 1;
            await jsonDB.set('otps.json', identifier, storedData);

            return {
                success: false,
                message: `Invalid OTP. ${this.MAX_ATTEMPTS - storedData.attempts} attempts remaining.`
            };
        }

        // OTP is valid
        storedData.verified = true;
        await jsonDB.set('otps.json', identifier, storedData);

        logger.success(`OTP verified for ${identifier}`);

        return {
            success: true,
            message: 'OTP verified successfully'
        };
    }

    /**
     * Check if OTP is expired
     */
    async isExpired(identifier) {
        const storedData = await jsonDB.get('otps.json', identifier);

        if (!storedData) return true;

        return new Date(storedData.expiresAt) < new Date();
    }

    /**
     * Cleanup expired OTPs (should run periodically)
     */
    async cleanupExpired() {
        try {
            const allOTPs = await jsonDB.readJSON('otps.json');
            const now = new Date();
            let cleaned = 0;

            for (const [identifier, data] of Object.entries(allOTPs)) {
                if (new Date(data.expiresAt) < now) {
                    await jsonDB.delete('otps.json', identifier);
                    cleaned++;
                }
            }

            if (cleaned > 0) {
                logger.info(`Cleaned up ${cleaned} expired OTPs`);
            }
        } catch (error) {
            logger.error('Error cleaning up OTPs:', error);
        }
    }

    /**
     * Delete OTP after successful verification
     */
    async deleteOTP(identifier) {
        await jsonDB.delete('otps.json', identifier);
    }
}

// Singleton instance
const otpService = new OTPService();

// Run cleanup every 10 minutes
setInterval(() => {
    otpService.cleanupExpired();
}, 10 * 60 * 1000);

module.exports = otpService;
