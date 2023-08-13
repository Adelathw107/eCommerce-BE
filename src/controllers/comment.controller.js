'use strict'

const { SuccessResponse } = require("../core/success.response")
const { createComment, getCommentsByParentId, deleteComments } = require("../services/comment.service")

class CommentController {

    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new comment success',
            metaData: await createComment(req.body)
        }).send(res)
    }
    deleteComments = async (req, res, next) => {
        new SuccessResponse({
            message: 'Deleted comment success',
            metaData: await deleteComments(req.body)
        }).send(res)
    }
    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get comments success',
            metaData: await getCommentsByParentId(req.body)
        }).send(res)
    }
}

module.exports = new CommentController