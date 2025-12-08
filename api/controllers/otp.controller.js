/**
 * OTP Authentication Controller
 * Handles OTP-based passwordless login flow
 */

const otpService = require('../services/otp.service');
const userService = require('../services/user.service');
const { generateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

class OTPController {
    /**
     * POST /api/auth/request-otp
     * Request OTP for login/registration
     */
    async requestOTP(req, res, next) {
        try {
            const { name, email, phone, address, method } = req.body;

            // Validate: need either phone or email
            if (!phone && !email) {
                return res.status(400).json({
                    success: false,
                    message: 'Either phone or email is required'
                });
            }

            // Determine identifier and method
            let identifier, otpMethod;

            if (method) {
                // User specified method
                otpMethod = method;
                identifier = method === 'phone' ? phone : email;

                if (!identifier) {
                    return res.status(400).json({
                        success: false,
                        message: `${method} is required for ${method} OTP`
                    });
                }
            } else {
                // Auto-select: prefer phone if available
                if (phone) {
                    identifier = phone;
                    otpMethod = 'phone';
                } else {
                    identifier = email;
                    otpMethod = 'email';
                }
            }

            // Check if user exists, if not prepare to create
            let user = await userService.getUserByIdentifier(identifier);

            if (!user && !name) {
                return res.status(400).json({
                    success: false,
                    message: 'Name is required for new users'
                });
            }

            // Send OTP
            const result = await otpService.requestOTP(identifier, otpMethod, name || user?.name);

            res.json({
                success: true,
                message: `OTP sent to your ${otpMethod}`,
                identifier,
                method: otpMethod,
                expiresIn: result.expiresIn,
                isNewUser: !user
            });

        } catch (error) {
            logger.error('Request OTP error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/auth/verify-otp
     * Verify OTP and login/register user
     */
    async verifyOTP(req, res, next) {
        try {
            const { identifier, otp, name, email, phone, address } = req.body;

            if (!identifier || !otp) {
                return res.status(400).json({
                    success: false,
                    message: 'Identifier and OTP are required'
                });
            }

            // Verify OTP
            const verification = await otpService.verifyOTP(identifier, otp);

            if (!verification.success) {
                return res.status(400).json(verification);
            }

            // Check if user exists
            let user = await userService.getUserByIdentifier(identifier);

            if (!user) {
                // New user - create account
                if (!name) {
                    return res.status(400).json({
                        success: false,
                        message: 'Name is required for registration'
                    });
                }

                user = await userService.createUser({
                    name,
                    email: email || (identifier.includes('@') ? identifier : null),
                    phone: phone || (!identifier.includes('@') ? identifier : null),
                    address: address || null
                });

                logger.success(`New user registered via OTP: ${identifier}`);
            } else {
                // Existing user - update last login
                await userService.updateLastLogin(identifier);
            }

            // Delete OTP after successful verification
            await otpService.deleteOTP(identifier);

            // Generate JWT token
            const token = generateToken({
                id: user.id,
                identifier: user.identifier,
                email: user.email,
                phone: user.phone
            });

            // Remove sensitive fields
            const { ...userResponse } = user;

            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: userResponse,
                isNewUser: !user.createdAt || new Date(user.createdAt).getTime() > Date.now() - 10000 // Created in last 10 seconds
            });

        } catch (error) {
            logger.error('Verify OTP error:', { error: error.message });
            next(error);
        }
    }

    /**
     * POST /api/auth/resend-otp
     * Resend OTP
     */
    async resendOTP(req, res, next) {
        try {
            const { identifier, method } = req.body;

            if (!identifier) {
                return res.status(400).json({
                    success: false,
                    message: 'Identifier is required'
                });
            }

            // Get user to get name
            const user = await userService.getUserByIdentifier(identifier);
            const userName = user?.name || 'Customer';

            // Send new OTP
            const result = await otpService.requestOTP(identifier, method, userName);

            res.json({
                success: true,
                message: `New OTP sent to your ${method}`,
                expiresIn: result.expiresIn
            });

        } catch (error) {
            logger.error('Resend OTP error:', { error: error.message });
            next(error);
        }
    }
}

module.exports = new OTPController();
