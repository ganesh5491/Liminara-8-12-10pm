/**
 * Content Management Routes
 * Admin routes for users, reviews, questions, and inquiries
 */

const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content-management.controller');

// ========================= USER ROUTES =========================
router.get('/users', contentController.getAllUsers);
router.get('/users/:id', contentController.getUser);
router.post('/users', contentController.createUser);
router.put('/users/:id/status', contentController.updateUserStatus);
router.delete('/users/:id', contentController.deleteUser);

// ========================= REVIEW ROUTES =========================
router.get('/reviews', contentController.getAllReviews);
router.get('/reviews/:id', contentController.getReview);
router.put('/reviews/:id/approve', contentController.approveReview);
router.put('/reviews/:id/reject', contentController.rejectReview);
router.delete('/reviews/:id', contentController.deleteReview);

// ========================= QUESTION ROUTES =========================
router.get('/questions', contentController.getAllQuestions);
router.put('/questions/:id/answer', contentController.answerQuestion);
router.delete('/questions/:id', contentController.deleteQuestion);

// ========================= INQUIRY ROUTES =========================
router.get('/inquiries', contentController.getAllInquiries);
router.get('/inquiries/:id', contentController.getInquiry);
router.put('/inquiries/:id/status', contentController.updateInquiryStatus);
router.put('/inquiries/:id/reply', contentController.replyToInquiry);

module.exports = router;
