import * as vscode from 'vscode';
import * as Net from 'net';
import { LLDBDebugSession } from './LLDBDebugSession';
import { getSwiftExecutable } from './utilities';

const useServer = true;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('"vscode-swift-lldb" is now active!');

	if (useServer) {
		const factory = new LLDBDebugServerDescriptorFactory();
		context.subscriptions.push(vscode.debug.registerDebugAdapterDescriptorFactory('swift-lldb', factory));
	}
}

// This method is called when your extension is deactivated
export function deactivate() {}

class LLDBDebugServerDescriptorFactory implements vscode.DebugAdapterDescriptorFactory {

	private server?: Net.Server;

	createDebugAdapterDescriptor(session: vscode.DebugSession, executable: vscode.DebugAdapterExecutable | undefined): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {

		if (!this.server) {
			// start listening on a random port
			this.server = Net.createServer(socket => {
				const session = new LLDBDebugSession(getSwiftExecutable("lldb-vscode"));
				session.run(socket, socket);
			}).listen(0);
		}

		// make VS Code connect to debug server
		return new vscode.DebugAdapterServer((this.server.address() as Net.AddressInfo).port);
	}

	dispose() {
		if (this.server) {
			this.server.close();
		}
	}
}
