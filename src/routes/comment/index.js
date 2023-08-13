'use strict';

const router = require('express').Router();

const { authenticationV2 } = require('../../auth/authUtils.js');
const CommentController = require('../../controllers/comment.controller.js');

const { asyncHandler } = require('../../helpers/asyncHandler.js');

router.use(authenticationV2)

// comment
router.post('', asyncHandler(CommentController.createComment));
router.delete('', asyncHandler(CommentController.deleteComments));
router.get('', asyncHandler(CommentController.getCommentsByParentId));

module.exports = router;
