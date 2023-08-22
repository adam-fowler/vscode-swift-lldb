import * as Net from 'net';
import { LLDBDebugSession } from "./debugSession";
import { getSwiftExecutable } from './utilities';

console.log("Hello");

// first parse command line arguments to see whether the debug adapter should run as a server
let port = 0;
const args = process.argv.slice(2);
args.forEach(function (val, index, array) {
	const portMatch = /^--server=(\d{4,5})$/.exec(val);
	if (portMatch) {
		port = parseInt(portMatch[1], 10);
	}
});

if (port > 0) {
	// start a server that creates a new session for every connection request
	console.error(`waiting for debug protocol on port ${port}`);
	Net.createServer((socket) => {
		console.error('>> accepted connection from client');
		let session = new LLDBDebugSession(getSwiftExecutable("lldb-vscode"));
		session.run(socket, socket);
	}).listen(port);
} else {
	let session = new LLDBDebugSession(getSwiftExecutable("lldb-vscode"));
	session.run(process.stdin, process.stdout);
}
