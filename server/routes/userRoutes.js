const express = require('express');
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.post('/getVerifyCode', authController.getVerifyCode);
router.post('/signup', authController.check2FACode, authController.signUp);
router.post('/login', authController.logIn);
router.get('/logout', authController.logOut);
router.post('/getAccountName', authController.getAccountName);
router.post('/getVerifyCodeForPasswordReset', authController.getVerifyCodeForPasswordReset);
router.post('/resetPassword', authController.check2FACode, authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);
router.patch('/upgradeUserTier', transactionController.checkTransactionKey, userController.upgradeUserTier);
router.patch('/updatePassword', transactionController.checkTransactionKey, authController.updatePassword);
router.get('/getVerifyCodeForTrxKeyUpdate', authController.getVerifyCodeForTrxKeyUpdate);
router.patch('/updateTrxKey', authController.check2FACode, userController.updateTrxKey);
router.post('/submitMessage', userController.submitMessage);

router.get('/me',
  userController.getMe,
  userController.getUser
);

// router.patch('/updateMe',
//   // userController.uploadUserPhoto,
//   // userController.resizeUserPhoto,
//   userController.updateMe
// );

// router.delete('/deleteMe', userController.deleteMe);

module.exports = router;