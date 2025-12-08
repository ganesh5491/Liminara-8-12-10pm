/**
 * Cleanup Script - Remove All PHP Files
 * Run this after verifying the Node.js backend works correctly
 * 
 * WARNING: This will permanently delete all PHP files!
 * Make sure you have backups before running this script.
 */

const fs = require('fs');
const path = require('path');

// PHP files and directories to delete
const filesToDelete = [
    // Root PHP files
    'bootstrap.php',
    'index.php',
    '.htaccess',

    // Auth endpoints
    'auth/logout.php',
    'auth/me.php',
    'auth/profile.php',
    'auth/sync.php',

    // Cart
    'cart/index.php',

    // Categories
    'categories/index.php',

    // Contact
    'contact/index.php',

    // Files
    'files/index.php',

    // Orders
    'orders/cancel.php',
    'orders/direct-checkout.php',
    'orders/index.php',
    'orders/single.php',

    // Payment
    'payment/config.php',
    'payment/create-razorpay-order.php',
    'payment/verify-razorpay.php',

    // Products
    'products/deals.php',
    'products/featured.php',
    'products/index.php',
    'products/questions.php',
    'products/reviews.php',
    'products/single.php',

    // Subcategories
    'subcategories/index.php',

    // Support
    'support/index.php',

    // Appointments
    'appointments/index.php',

    // Video call
    'video-call/start.php',

    // Wishlist
    'wishlist/index.php',

    // Config files
    'config/email_config.php',
    'config/mail_service.php',
    'config/simple_sms_service.php',
    'config/sms_config.php',
    'config/sms_service.php',

    // Database files
    'database/mysql_connection.php',
    'database/mysql_operations.php',

    // Templates
    'templates/cancellation_templates.php',
    'templates/contact_templates.php',
    'templates/meeting_templates.php',
    'templates/order_templates.php',
    'templates/support_templates.php',

    // Storage data files (WARNING: May contain actual data!)
    'storage/data/appointments.php',
    'storage/data/cartItems.php',
    'storage/data/categories.php',
    'storage/data/contactInquiries.php',
    'storage/data/orderItems.php',
    'storage/data/orders.php',
    'storage/data/productQuestions.php',
    'storage/data/productReviews.php',
    'storage/data/products.php',
    'storage/data/subcategories.php',
    'storage/data/supportTickets.php',
    'storage/data/users.php',
    'storage/data/wishlistItems.php'
];

// Directories to remove (entire folders)
const dirsToDelete = [
    'vendor' // PHP vendor directory (Composer packages)
];

// Base directory
const apiDir = __dirname;

console.log('🗑️  PHP Cleanup Script\n');
console.log('This will delete the following files:\n');

// List files that will be deleted
let deletedCount = 0;
let errorCount = 0;

filesToDelete.forEach(file => {
    const fullPath = path.join(apiDir, file);
    if (fs.existsSync(fullPath)) {
        console.log(`  ✓ ${file}`);
    } else {
        console.log(`  ⚠ ${file} (not found)`);
    }
});

console.log('\nAnd these directories:\n');

dirsToDelete.forEach(dir => {
    const fullPath = path.join(apiDir, dir);
    if (fs.existsSync(fullPath)) {
        console.log(`  ✓ ${dir}/`);
    } else {
        console.log(`  ⚠ ${dir}/ (not found)`);
    }
});

// Confirmation prompt (when run interactively)
console.log('\n⚠️  WARNING: This action cannot be undone!');
console.log('Make sure you have backed up your files before proceeding.\n');

// Uncomment below to actually delete files
// ONLY RUN THIS AFTER YOU'VE VERIFIED THE NODE.JS BACKEND WORKS!

/*
console.log('Starting deletion...\n');

// Delete files
filesToDelete.forEach(file => {
  const fullPath = path.join(apiDir, file);
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`✓ Deleted: ${file}`);
      deletedCount++;
    }
  } catch (error) {
    console.error(`✗ Error deleting ${file}:`, error.message);
    errorCount++;
  }
});

// Delete directories
dirsToDelete.forEach(dir => {
  const fullPath = path.join(apiDir, dir);
  try {
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`✓ Deleted: ${dir}/`);
      deletedCount++;
    }
  } catch (error) {
    console.error(`✗ Error deleting ${dir}/:`, error.message);
    errorCount++;
  }
});

console.log(`\n✅ Cleanup complete!`);
console.log(`   Deleted: ${deletedCount} items`);
console.log(`   Errors: ${errorCount}`);

// Delete empty directories
const emptyDirs = ['auth', 'cart', 'categories', 'contact', 'files', 'orders', 
                   'payment', 'products', 'subcategories', 'support', 'appointments',
                   'video-call', 'wishlist', 'templates', 'storage/data'];

emptyDirs.forEach(dir => {
  const fullPath = path.join(apiDir, dir);
  try {
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath);
      if (files.length === 0) {
        fs.rmdirSync(fullPath);
        console.log(`✓ Removed empty directory: ${dir}/`);
      }
    }
  } catch (error) {
    // Ignore errors
  }
});
*/

console.log('\n💡 To actually delete files, uncomment the deletion code in this script.');
console.log('   File: cleanup-php.js (lines 123-177)\n');
