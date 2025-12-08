/**
 * SMS Service
 * Converted from config/sms_service.php
 * Multi-provider SMS support (Fast2SMS, Twilio, MSG91, TextLocal)
 */

const axios = require('axios');
const SmsConfig = require('./sms.config');
const logger = require('../utils/logger');

class SmsService {
    constructor(provider = null) {
        this.provider = provider || SmsConfig.getPrimaryProvider();
        this.config = SmsConfig.getProviderConfig(this.provider);

        if (!this.config || !this.config.enabled) {
            logger.warn(`SMS provider '${this.provider}' is not enabled or configured`);
        }
    }

    /**
     * Send SMS message
     */
    async sendSms(to, message, template = null, variables = {}) {
        try {
            // Validate phone number
            if (!SmsConfig.validatePhoneNumber(to)) {
                throw new Error(`Invalid phone number format: ${to}`);
            }

            // Format phone number
            const formattedPhone = SmsConfig.formatPhoneNumber(to);

            // Use template if provided
            if (template) {
                message = this.renderTemplate(template, variables);
            }

            // Send SMS based on provider
            const result = await this.sendViaProvider(formattedPhone, message);

            if (result.success) {
                logger.success(`SMS sent successfully to ${formattedPhone} via ${this.provider}`);
                return {
                    success: true,
                    message: 'SMS sent successfully',
                    provider: this.provider,
                    phone: formattedPhone,
                    messageId: result.messageId || null
                };
            } else {
                throw new Error(result.error || 'Failed to send SMS');
            }
        } catch (error) {
            logger.error('SMS sending failed:', { error: error.message });

            return {
                success: false,
                error: error.message,
                provider: this.provider,
                phone: to
            };
        }
    }

    /**
     * Send SMS via specific provider
     */
    async sendViaProvider(phone, message) {
        switch (this.provider) {
            case 'fast2sms':
                return await this.sendViaFast2SMS(phone, message);
            case 'twilio':
                return await this.sendViaTwilio(phone, message);
            case 'msg91':
                return await this.sendViaMsg91(phone, message);
            case 'textlocal':
                return await this.sendViaTextLocal(phone, message);
            default:
                throw new Error(`Unsupported SMS provider: ${this.provider}`);
        }
    }

    /**
     * Send via Fast2SMS
     */
    async sendViaFast2SMS(phone, message) {
        try {
            const response = await axios.post(
                this.config.apiUrl,
                {
                    route: 'v3',
                    sender_id: 'LIMNRA',
                    message: message,
                    language: 'english',
                    flash: 0,
                    numbers: phone
                },
                {
                    headers: {
                        authorization: this.config.headers.authorization,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.return === true) {
                return {
                    success: true,
                    messageId: response.data.request_id
                };
            }

            return {
                success: false,
                error: response.data.message || 'Fast2SMS API error'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send via Twilio
     */
    async sendViaTwilio(phone, message) {
        try {
            const url = `${this.config.apiUrl}/${this.config.accountSid}/Messages.json`;

            const response = await axios.post(
                url,
                new URLSearchParams({
                    From: this.config.fromNumber,
                    To: `+${phone}`,
                    Body: message
                }),
                {
                    auth: {
                        username: this.config.accountSid,
                        password: this.config.authToken
                    }
                }
            );

            if (response.data.sid) {
                return {
                    success: true,
                    messageId: response.data.sid
                };
            }

            return {
                success: false,
                error: 'Twilio API error'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    /**
     * Send via MSG91
     */
    async sendViaMsg91(phone, message) {
        try {
            const response = await axios.post(
                this.config.apiUrl,
                {
                    template_id: '60ba4e4c9b1d7e0c5c8b4567',
                    sender: 'LIMNRA',
                    short_url: 0,
                    mobiles: phone,
                    message: message
                },
                {
                    headers: {
                        authkey: this.config.headers.authkey,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.type === 'success') {
                return {
                    success: true,
                    messageId: response.data.request_id
                };
            }

            return {
                success: false,
                error: response.data.message || 'MSG91 API error'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Send via TextLocal
     */
    async sendViaTextLocal(phone, message) {
        try {
            const response = await axios.post(
                this.config.apiUrl,
                new URLSearchParams({
                    apikey: this.config.apiKey,
                    numbers: phone,
                    message: message,
                    sender: this.config.sender
                })
            );

            if (response.data.status === 'success') {
                return {
                    success: true,
                    messageId: response.data.batch_id
                };
            }

            return {
                success: false,
                error: response.data.errors?.[0]?.message || 'TextLocal API error'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Render message template
     */
    renderTemplate(templateName, variables = {}) {
        const templates = SmsConfig.getMessageTemplates();

        if (!templates[templateName]) {
            throw new Error(`SMS template '${templateName}' not found`);
        }

        let template = templates[templateName].template;

        // Replace variables in template
        Object.keys(variables).forEach(key => {
            template = template.replace(new RegExp(`\\{${key}\\}`, 'g'), variables[key]);
        });

        // Check for unreplaced variables
        if (/\{[a-zA-Z_]+\}/.test(template)) {
            logger.warn(`Unreplaced variables found in SMS template: ${template}`);
        }

        return template;
    }

    /**
     * Static method to send order confirmation SMS
     */
    static async sendOrderConfirmationSms(orderData) {
        try {
            const enabledProviders = SmsConfig.getEnabledProviders();
            if (enabledProviders.length === 0) {
                return {
                    success: false,
                    error: 'No SMS providers configured',
                    skipped: true
                };
            }

            if (!orderData.customerPhone) {
                return {
                    success: false,
                    error: 'Customer phone number not provided',
                    skipped: true
                };
            }

            const smsService = new SmsService();

            const variables = {
                orderId: orderData.orderId,
                amount: `₹${parseFloat(orderData.total).toFixed(2)}`,
                trackingUrl: `https://liminara.com/track/${orderData.orderId}`
            };

            return await smsService.sendSms(
                orderData.customerPhone,
                null,
                'order_confirmation',
                variables
            );
        } catch (error) {
            logger.error('SMS Service Error:', { error: error.message });
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = SmsService;
