import {handleRequest} from "./handler.js";

serve(function (request, connInfo) {
	let clientIp = connInfo.remoteAddr.hostname;
	return handleRequest(request, clientIp);
});