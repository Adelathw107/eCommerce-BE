'use strict';

const notificationModel = require("../models/notification.model");


class NotificationService {

    static async pushNotiToSystem({
        type = "SHOP-001",
        recievedId = 1,
        senderId = 1,
        options = {}
    }) {
        let noti_content
        if (type == 'SHOP-001') {
            noti_content = `@@@ vừa thêm 1 sản phẩm mới: @@@@`
        }
        else if (type == 'PROMOTION-001') {
            noti_content = `@@@ vừa thêm 1 voucher mới: @@@@@`
        }

        const newNoti = await notificationModel.create({
            noti_type: type,
            noti_content,
            noti_senderId: senderId,
            noti_recievedId: recievedId,
            noti_options: options

        })
        return newNoti
    }
}


module.exports = NotificationService
