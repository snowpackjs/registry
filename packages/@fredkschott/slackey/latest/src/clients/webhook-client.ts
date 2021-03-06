import { SlackError } from '../slack-error';
import { makeWebhookRequest } from '../make-webhook-request';
import { encode as encodeQueryString } from '../qss';

/**
 * SlackWebhookClient - A client for working with a Slack Incoming Webhook URL. Each client is
 * created to work with a single webhook. These URLs require no authorization to send messages,
 * other than the URL itself.
 *
 * @constructor
 * @param {Object} options A collection of options to configure the client.
 * @param {string} options.webhookURL An Incoming Webhook URL to send messages to
 * @return {void}
 */
export function SlackWebhookClient(options) {
  if (!options || !options.webhookURL) {
    throw new Error(
      'SlackWebhookClient constructor requires the `webhookURL` option'
    );
  }
  this.webhookURL = options.webhookURL;
}

/** @type {SlackError} Attach the custom type to the SlackWebhookClient for consumer access */
SlackWebhookClient.prototype.SlackError = SlackError;

/**
 * Call an Incoming Webhook following Slack's webhook calling conventions.
 * See {@link https://api.slack.com/incoming-webhooks} for more information.
 *
 * @param {Object} payload The webhook payload, containing "text" and other arguments
 * @param {Function} [callback] An optional callback to propagate any errors/success to
 * @callback {[Error]} If an error occurs, it will be propagated to the client. If successful,
 *  the callback will be called (no success arguments since no valuable info is returned).
 */
SlackWebhookClient.prototype.send = function(payload, callback) {
  callback =
    callback ||
    function() {
      /* no-op */
    };

  const requestOptions = {
    url: this.webhookURL,
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodeQueryString({ payload: JSON.stringify(payload) })
  };
  makeWebhookRequest(requestOptions, callback);
};
