'use strict'

const { NotFoundError } = require("../core/error.response")
const CommentModel = require("../models/comment.model")
const { findProduct } = require("../models/repository/product.repo.")
const { convertToObjectIdMongodb } = require("../utils")

/**
 * key  features: Comment Service 
 * + add Comment [User, shop]
 * + get a list of comments [User, Shop]
 * + delete a comment [User , Shop , Admin]
 */
class CommentService {

    // create comment
    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new CommentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue
        if (parentCommentId) {
            // reply comment
            const parentComment = await CommentModel.findOne(convertToObjectIdMongodb(parentCommentId));
            if (!parentComment) throw new NotFoundError('Parent comment not found')

            rightValue = parentComment.comment_right;
            // updatemany comments
            await CommentModel.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })
            await CommentModel.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })

        } else {

            const maxRightValue = await CommentModel.findOne({
                comment_productId: convertToObjectIdMongodb(productId),
            })

            if (maxRightValue) {
                rightValue = maxRightValue.right + 1;
            } else {
                rightValue = 1
            }
        }
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        return comment

    }

    // get Comment
    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0 // skip
    }) {
        if (parentCommentId) {
            const parentComment = await CommentModel.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError("Not found Comment")

            const comments = await CommentModel.find({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gte: parentComment.comment_left },
                comment_right: { $lte: parentComment.comment_right }
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })
            return comments
        }
        else {
            const comments = await CommentModel.find({
                comment_productId: convertToObjectIdMongodb(productId),
                parentCommentId: null
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })
            return comments
        }
    }

    // delete Comment
    static async deleteComments({
        commentId, productId
    }) {
        // check product exists in db
        const foundProduct = await findProduct({ product_id: productId })
        if (!foundProduct) throw new NotFoundError("Product Not found !!!!")

        const foundComment = await CommentModel.findById(commentId)
        if (!foundComment) throw new NotFoundError("Comment Not found !!!")

        // Define left and right value
        const leftValue = foundComment.comment_left;
        const rightValue = foundComment.comment_right;

        // calculate width
        const width = rightValue - leftValue + 1

        // delete all child comment
        await CommentModel.deleteMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gte: leftValue },
            comment_right: { $lte: rightValue }
        })

        // Update left , right value others
        await CommentModel.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_right: -width }
        })

        await CommentModel.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: { comment_left: -width }
        })
    }

}

module.exports = CommentService