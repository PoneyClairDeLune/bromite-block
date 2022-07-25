"use strict";

import {parseUserAgent} from "./uaParser.js";
import {wrapHtml} from "./wrapHtml.js";

const passState = ["N/A", "Passed", "Blocked", "Suspicious"],
promptText = [
	"Ah, you seem to use ${browser}. No tests are performed.",
	"All checks passed. Congrats!",
	"Somepony is hiding themselves, how naughty:",
	"Somepony is acting very suspicious:"
];

let handleRequest = function (request) {
	let passed = 0, reasons = "";
	let uaStr = parseUserAgent(request.headers.get("user-agent"));
	console.info(`User agent object: ${JSON.stringify(uaStr)}`);
	console.info(`User agent string: ${request.headers.get("user-agent")}`);
	if (uaStr.agent == "Chrome") {
		// For full verdict, one must test presence of sec-ch-ua, sec-ch-ua-mobile and sec-ch-ua-platform
		if (!request.headers.has("sec-ch-ua") && uaStr.agentVer[0] > 88) {
			console.warn("Client hints stripped away intentionally.");
			passed = 3;
		};
		if (uaStr.platformName == "Android") {
			passed = 1;
			// Version test
			let equalsZero = 0;
			uaStr.agentVer.forEach(function (e) {
				if (e == 0) {
					equalsZero ++;
				};
			});
			if (equalsZero > 1) {
				if (uaStr.agentVer[0] < 103) {
					console.warn("Intentionally hiding version in user agent.");
					passed = 2;
				} else {
					if (request.headers.has("sec-ch-ua")) {
						if (request.headers.has("sec-ch-ua-full-version")) {
							if (request.headers.get("sec-ch-ua-full-version").indexOf(".0.0") > -1) {
								console.warn("Intentionally hiding version in client hints.");
								passed = 2;
							};
						};
					} else {
						console.warn("No client hints available for versio detection.");
						passed = 2;
					};
				};
			};
			if (uaStr.deviceModel.length < 4) {
				console.warn("Illegal device model.");
				passed = 2;
			};
		};
	};
	let response = wrapHtml(200, passState[passed], `${promptText[passed]}`.replace("${browser}", uaStr.agent));
	console.info(`Server-side detection: ${passState[passed].toLowerCase()}.`);
	return response;
};

export {
	handleRequest
};