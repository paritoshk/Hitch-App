"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = betterWs;
var WebSocket = typeof window !== "undefined" ? window.WebSocket : require("ws");
var EventEmitter = require("eventemitter2").EventEmitter2;

function betterWs(url) {
	var conn = new WebSocket(url);
	var ee = new EventEmitter();

	ee.setMaxListeners(0);

	ee.send = function (dataObj) {
		if (conn.readyState !== 1) {
			ee.on("open", function sender() {
				conn.send(JSON.stringify(dataObj));
				ee.removeListener("open", sender);
			});
		} else {
			conn.send(JSON.stringify(dataObj));
			return this;
		}
	};

	conn.onopen = function () {
		ee.emit("open");
	};

	conn.onmessage = function (message) {
		var dataObj = JSON.parse(message.data);
		ee.emit("message", dataObj);
	};

	conn.onerror = function (err) {
		ee.emit("error", err);
	};

	conn.onclose = function (close) {
		ee.emit("close", close);
	};

	return ee;
};
module.exports = exports["default"];