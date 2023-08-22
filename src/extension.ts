import * as vscode from 'vscode';
import * as Net from 'net';
import { LLDBDebugSession } from './debugSession';
import { getSwiftExecutable } from './utilities';
import { LLDBDebugAdapterTrackerFactory } from './debugAdapterTracker';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('"vscode-swift-lldb" is now active!');

	const factory = vscode.debug.registerDebugAdapterDescriptorFactory('swift-lldb', new LLDBDebugAdapterExecutableFactory());
	const tracker = vscode.debug.registerDebugAdapterTrackerFactory('swift-lldb', new LLDBDebugAdapterTrackerFactory());
	
	context.subscriptions.push(factory, tracker);
}

// This method is called when your extension is deactivated
export function deactivate() {}

class LLDBDebugAdapterExecutableFactory implements vscode.DebugAdapterDescriptorFactory {

	// The following use of a DebugAdapter factory shows how to control what debug adapter executable is used.
	// Since the code implements the default behavior, it is absolutely not neccessary and we show it here only for educational purpose.

	createDebugAdapterDescriptor(_session: vscode.DebugSession, executable: vscode.DebugAdapterExecutable | undefined): vscode.ProviderResult<vscode.DebugAdapterDescriptor> {
		// param "executable" contains the executable optionally specified in the package.json (if any)

		// use the executable specified in the package.json if it exists or determine it based on some other information (e.g. the session)
		if (!executable) {
			executable = new vscode.DebugAdapterExecutable(getSwiftExecutable("lldb-vscode"), [], {});
		}

		// make VS Code launch the DA executable
		return executable;
	}
}

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
