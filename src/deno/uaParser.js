"use strict";

const winNtMap = {
	"5.1": "Windows XP",
	"5.2": "Windows XP",
	"6.0": "Windows Vista",
	"6.1": "Windows 7",
	"6.2": "Windows 8",
	"6.3": "Windows 8.1",
	"10.0": "Windows 10",
	"11.0": "Windows 11"
};

class Version extends Array {
	constructor(verStr) {
		super();
		let upThis = this;
		verStr.split(".").forEach(function (e, i) {
			upThis[i] = parseInt(e);
		});
	};
	toString() {
		let ver = "";
		this.forEach(function (e, i) {
			ver += (i != 0 ? "." : "");
			ver += e;
		});
		return ver;
	};
};

class ProgramDetails {
	constructor(name, version) {
		this.name = name;
		this.version = new Version(version);
	};
}

let parseUserAgent = function (uaStr) {
	let uaStrA = `${uaStr} `;
	let rawArr = [], rawObj = {},
	resultObj = {
		isBrowser: false,
		platform: "",
		deviceArch: "na", // one of na, i386, amd64, arm, arm64, riscv
		deviceModel: "",
		wowState: "na", // one of na, wow64, x64
		platformName: "",
		mobile: false,
		agent: "",
		agentVer: [0],
		altVer: [0],
		sysVer: [0]
	};
	let mode = 0, softName = "", softVer = "", platDet = [""];
	Array.from(uaStrA).forEach(function (e) {
		switch (mode) {
			case 0: {
				// Program name
				if (e == "/") {
					softName = softName.trim();
					mode = 1;
				} else if (e == " ") {
					rawArr.push(new ProgramDetails(softName, "0"));
					softName = "";
				} else {
					softName += e;
				};
				break;
			};
			case 1: {
				// Program version
				if (e != " ") {
					softVer += e;
				} else {
					rawArr.push(new ProgramDetails(softName, softVer));
					softName = "";
					softVer = "";
					mode = 2;
				};
				break;
			};
			case 2: {
				// Waiting for platform details
				if (e == "(") {
					// Start parsing platform details
					mode = 3;
				} else {
					// Return to program name
					softName += e;
					mode = 0;
				};
				break;
			};
			case 3: {
				if (e == ")") {
					// Finishing platform details parsing
					platDet.forEach(function (e, i, a) {
						a[i] = e.trim();
					});
					rawArr[rawArr.length - 1].platRaw = platDet;
					platDet = [""];
					mode = 0;
				} else if (e == ";") {
					platDet.push("");
				} else {
					platDet[platDet.length - 1] += e;
				};
				break;
			};
		};
	});
	rawArr.forEach(function (e) {
		if (e?.name?.length > 0) {
			rawObj[e.name.toLowerCase()] = e;
		};
	});
	// Platform and device information
	if (rawObj.mozilla) {
		resultObj.isBrowser = true;
		rawObj.mozilla.platRaw.forEach(function (e, i, a) {
			if (e.indexOf("Windows NT ") > -1) {
				resultObj.platform = "windows";
				resultObj.platformName = winNtMap[e.slice(11)];
				resultObj.sysVer = new Version(e.slice(11));
				resultObj.deviceArch = "i386";
			};
			switch (e) {
				case "Linux": {
					resultObj.platform = "linux";
					resultObj.platformName = "Linux";
					break;
				};
				case "Win64": {
					resultObj.deviceArch = "amd64";
					break;
				};
				case "Windows NT 5.1": {
					resultObj.deviceArch = "i386";
					break;
				};
				case "Windows NT 5.2": {
					resultObj.deviceArch = "amd64";
					break;
				};
				case "WOW64": {
					resultObj.wowState = "wow64";
					resultObj.deviceArch = "amd64";
					break;
				};
				case "x64": {
					resultObj.wowState = "x64";
					resultObj.deviceArch = "amd64";
					break;
				};
				default: {
					if (e.indexOf("rv:") > -1) {
						resultObj.altVer = new Version(e.slice(3));
					} else if (e.indexOf("Android ") > -1) {
						resultObj.platformName = "Android";
						resultObj.sysVer = new Version(e.slice(8));
					} else if (i + 1 == a.length) {
						resultObj.deviceModel = e;
					} else {
						console.error(`Unparsed string "${e}" at Mozilla:${i}`);
					};
				};
			};
		});
		if (rawObj.mobile) {
			resultObj.mobile = true;
		};
		// Browser information
		if (rawObj.firefox) {
			resultObj.agentVer = rawObj.firefox.version;
			resultObj.agent = "Firefox";
		} else if (rawObj.chrome) {
			resultObj.agentVer = rawObj.chrome.version;
			resultObj.agent = "Chrome";
		} else if (rawObj.safari) {
			resultObj.agentVer = rawObj.safari.version;
			resultObj.agent = "Safari";
		};
	} else {
		resultObj.agent = rawArr[0].name;
		resultObj.agentVer = rawArr[0].version;
	};
	return resultObj;
};

export {
	parseUserAgent
};