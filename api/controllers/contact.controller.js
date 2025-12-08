/**
 * Contact Controller
 * Converted from contact/index.php
 */

const Contact = require('../models/Contact');
const emailService = require('../services/email.service');
const logger = require('../utils/logger');

class ContactController {
    /**
     * POST /api/contact
     * Submit contact inquiry
     */
    async submitContact(req, res, next) {
        try {
            const { firstName, lastName, email, phone, inquiryType, message } = req.body;

            if (!firstName || !lastName || !email || !message) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            // Create inquiry
            const inquiryId = await Contact.createInquiry({
                firstName,
                lastName,
                email,
                phone,
                inquiryType: inquiryType || 'general',
                message
            });

            // Send confirmation email to user
            const userHtmlBody = `
        <h2>Thank you for contacting us!</h2>
        <p>Dear ${firstName} ${lastName},</p>
        <p>We have received your inquiry and will get back to you soon.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <p>Best regards,<br>Liminara Team</p>
      `;

            await emailService.sendMail(
                email,
                'Contact Confirmation - Liminara',
                userHtmlBody
            );

            // Send notification to admin
            const adminHtmlBody = `
        <h2>New Contact Inquiry</h2>
        <p><strong>From:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Type:</strong> ${inquiryType || 'general'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `;

            await emailService.sendMail(
                process.env.ADMIN_EMAIL,
                'New Contact Inquiry - Liminara',
                adminHtmlBody
            );

            res.status(201).json({
                id: inquiryId,
                message: 'Contact inquiry submitted successfully'
            });
        } catch (error) {
            logger.error('Submit contact error:', { error: error.message });
            next(error);
        }
    }
}

module.exports = new ContactController();
