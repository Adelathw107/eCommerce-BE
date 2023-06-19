'use strict'

const _ = require('lodash')
const { Types: { ObjectId } } = require('mongoose')

const convertToObjectIdMongodb = userId => new ObjectId(userId)

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(ele => [ele, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(ele => [ele, 0]))
}

const removeUnderfinedObject = obj => {
    Object.keys(obj).forEach(i => {
        if (obj[i] == null || obj[i] == undefined) {
            delete obj[i]
        }
    })
    return obj
}

const updateNestedObjectParser = obj => {
    const final = {}

    Object.keys(obj).forEach(i => {
        if (typeof obj[i] === 'object' && !Array.isArray(obj[i]) && obj[i] !== null) {
            const response = updateNestedObjectParser(obj[i])
            Object.keys(response).forEach(a => {
                final[`${i}.${a}`] = response[a]
            })
        } else {
            final[i] = obj[i]
        }
    })
    return final
}
module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUnderfinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb
}