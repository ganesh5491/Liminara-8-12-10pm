/**
 * User/Review/Message Management Controller
 * Handles user, review, and message operations for admin panel
 */

const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../../data/users.json');
const reviewsFile = path.join(__dirname, '../../data/productReviews.json');
const questionsFile = path.join(__dirname, '../../data/productQuestions.json');
const inquiriesFile = path.join(__dirname, '../../data/contactInquiries.json');

// Read JSON file safely
const readJSON = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Write JSON file safely
const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

// ========================= USER MANAGEMENT =========================

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = readJSON(usersFile);
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get single user
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const users = readJSON(usersFile);
    const user = users.find(u => u.id === id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Update user status
exports.updateUserStatus = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const users = readJSON(usersFile);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    users[userIndex].status = status;
    users[userIndex].updatedAt = new Date().toISOString();
    writeJSON(usersFile, users);

    res.json({
      message: 'User status updated',
      user: users[userIndex],
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;

    const users = readJSON(usersFile);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    writeJSON(usersFile, users);

    res.json({
      message: 'User deleted',
      user: deletedUser,
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Create new user/customer
exports.createUser = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { name, email, phone, address, city, state, pincode, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const users = readJSON(usersFile);
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      status: status || 'active',
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeJSON(usersFile, users);

    res.status(201).json({
      message: 'Customer created successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Error creating customer' });
  }
};

// ========================= REVIEW MANAGEMENT =========================

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = readJSON(reviewsFile);
    res.json(reviews);
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Get single review
exports.getReview = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = readJSON(reviewsFile);
    const review = reviews.find(r => r.id === id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json(review);
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ message: 'Error fetching review' });
  }
};

// Approve review
exports.approveReview = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;

    const reviews = readJSON(reviewsFile);
    const reviewIndex = reviews.findIndex(r => r.id === id);

    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    reviews[reviewIndex].status = 'approved';
    reviews[reviewIndex].approvedAt = new Date().toISOString();
    writeJSON(reviewsFile, reviews);

    res.json({
      message: 'Review approved',
      review: reviews[reviewIndex],
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ message: 'Error approving review' });
  }
};

// Reject review
exports.rejectReview = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const reviews = readJSON(reviewsFile);
    const reviewIndex = reviews.findIndex(r => r.id === id);

    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    reviews[reviewIndex].status = 'rejected';
    reviews[reviewIndex].rejectionReason = reason || '';
    reviews[reviewIndex].rejectedAt = new Date().toISOString();
    writeJSON(reviewsFile, reviews);

    res.json({
      message: 'Review rejected',
      review: reviews[reviewIndex],
    });
  } catch (error) {
    console.error('Reject review error:', error);
    res.status(500).json({ message: 'Error rejecting review' });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;

    const reviews = readJSON(reviewsFile);
    const reviewIndex = reviews.findIndex(r => r.id === id);

    if (reviewIndex === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const deletedReview = reviews.splice(reviewIndex, 1)[0];
    writeJSON(reviewsFile, reviews);

    res.json({
      message: 'Review deleted',
      review: deletedReview,
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
};

// ========================= QUESTION MANAGEMENT =========================

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = readJSON(questionsFile);
    res.json(questions);
  } catch (error) {
    console.error('Get all questions error:', error);
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

// Answer question
exports.answerQuestion = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({ message: 'Answer is required' });
    }

    const questions = readJSON(questionsFile);
    const questionIndex = questions.findIndex(q => q.id === id);

    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }

    questions[questionIndex].answer = answer;
    questions[questionIndex].answeredAt = new Date().toISOString();
    questions[questionIndex].answeredBy = req.session.adminId;
    writeJSON(questionsFile, questions);

    res.json({
      message: 'Question answered',
      question: questions[questionIndex],
    });
  } catch (error) {
    console.error('Answer question error:', error);
    res.status(500).json({ message: 'Error answering question' });
  }
};

// Delete question
exports.deleteQuestion = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;

    const questions = readJSON(questionsFile);
    const questionIndex = questions.findIndex(q => q.id === id);

    if (questionIndex === -1) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const deletedQuestion = questions.splice(questionIndex, 1)[0];
    writeJSON(questionsFile, questions);

    res.json({
      message: 'Question deleted',
      question: deletedQuestion,
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: 'Error deleting question' });
  }
};

// ========================= INQUIRY MANAGEMENT =========================

// Get all inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = readJSON(inquiriesFile);
    res.json(inquiries);
  } catch (error) {
    console.error('Get all inquiries error:', error);
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
};

// Get single inquiry
exports.getInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const inquiries = readJSON(inquiriesFile);
    const inquiry = inquiries.find(i => i.id === id);

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    res.json(inquiry);
  } catch (error) {
    console.error('Get inquiry error:', error);
    res.status(500).json({ message: 'Error fetching inquiry' });
  }
};

// Update inquiry status
exports.updateInquiryStatus = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const inquiries = readJSON(inquiriesFile);
    const inquiryIndex = inquiries.findIndex(i => i.id === id);

    if (inquiryIndex === -1) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiries[inquiryIndex].status = status;
    inquiries[inquiryIndex].updatedAt = new Date().toISOString();
    writeJSON(inquiriesFile, inquiries);

    res.json({
      message: 'Inquiry status updated',
      inquiry: inquiries[inquiryIndex],
    });
  } catch (error) {
    console.error('Update inquiry status error:', error);
    res.status(500).json({ message: 'Error updating inquiry' });
  }
};

// Reply to inquiry
exports.replyToInquiry = async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const { id } = req.params;
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ message: 'Reply is required' });
    }

    const inquiries = readJSON(inquiriesFile);
    const inquiryIndex = inquiries.findIndex(i => i.id === id);

    if (inquiryIndex === -1) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }

    inquiries[inquiryIndex].reply = reply;
    inquiries[inquiryIndex].repliedAt = new Date().toISOString();
    inquiries[inquiryIndex].status = 'replied';
    writeJSON(inquiriesFile, inquiries);

    res.json({
      message: 'Reply sent',
      inquiry: inquiries[inquiryIndex],
    });
  } catch (error) {
    console.error('Reply to inquiry error:', error);
    res.status(500).json({ message: 'Error replying to inquiry' });
  }
};

module.exports = exports;
