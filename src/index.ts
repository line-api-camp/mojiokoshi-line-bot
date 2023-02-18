import './alias'
import './libs/firebase/app'

// ------------
// https

if (!process.env.FUNCTION_TARGET || process.env.FUNCTION_TARGET === 'lineBot') {
  exports.lineBot = require('./funcs/line-bot')
}

if (!process.env.FUNCTION_TARGET || process.env.FUNCTION_TARGET === 'stripeWebhook') {
  exports.stripeWebhook = require('./funcs/stripe-webhook')
}
