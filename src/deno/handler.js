"use strict";

import {parseUserAgent} from "./uaParser.js";
import {wrapHtml} from "./wrapHtml.js";

const passState = ["N/A", "Passed", "Blocked", "Suspicious"],
promptText = [
	"Ah, you seem aren't using a Chromium-based browser. No tests are performed.",
	"All checks passed. Congrats!",
	"Somepony is hiding themselves, how naughty.",
	"Somepony is acting very suspicious."
];

let handleRequest = function (request) {
	let passed = 0;
	let uaStr = parseUserAgent(request.headers.get("user-agent"));
	let response = wrapHtml(200, passState[passed], `${JSON.stringify(uaStr)}<br/>${promptText[passed]}`);
	console.info(`Server-side detection: ${passState[passed].toLowerCase()}`);
	return response;
};

export {
	handleRequest
};