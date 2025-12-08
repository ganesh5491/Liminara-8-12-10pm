/**
 * SMS Service Configuration
 * Converted from config/sms_config.php
 */

const { validatePhoneNumber, formatPhoneNumber } = require('../utils/helpers');

class SmsConfig {
    static getProviderConfig(provider) {
        const configs = {
            fast2sms: {
                enabled: !!process.env.FAST2SMS_API_KEY,
                apiUrl: 'https://www.fast2sms.com/dev/bulkV2',
                headers: {
                    authorization: process.env.FAST2SMS_API_KEY
                }
            },
            twilio: {
                enabled: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
                apiUrl: 'https://api.twilio.com/2010-04-01/Accounts',
                accountSid: process.env.TWILIO_ACCOUNT_SID,
                authToken: process.env.TWILIO_AUTH_TOKEN,
                fromNumber: process.env.TWILIO_FROM_NUMBER
            },
            msg91: {
                enabled: !!process.env.MSG91_AUTH_KEY,
                apiUrl: 'https://api.msg91.com/api/v5/flow/',
                headers: {
                    authkey: process.env.MSG91_AUTH_KEY
                }
            },
            textlocal: {
                enabled: !!process.env.TEXTLOCAL_API_KEY,
                apiUrl: 'https://api.textlocal.in/send/',
                apiKey: process.env.TEXTLOCAL_API_KEY,
                sender: 'LIMNRA'
            }
        };

        return configs[provider] || null;
    }

    static getPrimaryProvider() {
        return process.env.SMS_PROVIDER || 'fast2sms';
    }

    static getEnabledProviders() {
        const providers = ['fast2sms', 'twilio', 'msg91', 'textlocal'];
        return providers.filter(p => {
            const config = this.getProviderConfig(p);
            return config && config.enabled;
        });
    }

    static getMessageTemplates() {
        return {
            order_confirmation: {
                template: 'Your order {orderId} has been confirmed! Amount: {amount}. Track: {trackingUrl}',
                variables: ['orderId', 'amount', 'trackingUrl']
            },
            order_shipped: {
                template: 'Your order {orderId} has been shipped! Track: {trackingUrl}',
                variables: ['orderId', 'trackingUrl']
            },
            appointment_confirmation: {
                template: 'Your appointment is confirmed for {date} at {time}. See you soon!',
                variables: ['date', 'time']
            },
            otp: {
                template: 'Your OTP is {otp}. Valid for 10 minutes. Do not share with anyone.',
                variables: ['otp']
            }
        };
    }

    static validatePhoneNumber(phone) {
        return validatePhoneNumber(phone);
    }

    static formatPhoneNumber(phone) {
        return formatPhoneNumber(phone);
    }
}

module.exports = SmsConfig;
