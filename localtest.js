'use strict'
const lambda = require('./index')
let event = null;
let context = null;
let callback = (err) => {
    console.log(err)
}
lambda.handler(event, context, callback)