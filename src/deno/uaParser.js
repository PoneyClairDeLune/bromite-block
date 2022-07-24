"use strict";

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
	let rawArr = [];
	let mode = 0, softName = "", softVer = "", platDet = [""];
	Array.from(uaStrA).forEach(function (e) {
		switch (mode) {
			case 0: {
				// Program name
				if (e == "/") {
					softName = softName.trim();
					mode = 1;
				} else if (e == " ") {
					rawArr.push(new ProgramDetails(softName, [0]));
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
	return rawArr;
};

export {
	parseUserAgent
};