import * as vscode from "vscode";

export class LLDBDebugAdapterTrackerFactory implements vscode.DebugAdapterTrackerFactory {
	createDebugAdapterTracker(session: vscode.DebugSession): vscode.ProviderResult<vscode.DebugAdapterTracker> {
		return new LLDBDebugAdapterTracker();
	}
}

class LLDBDebugAdapterTracker implements vscode.DebugAdapterTracker {
	/**
	 * A session with the debug adapter is about to be started.
	 */
	onWillStartSession?(): void {
        console.log("Start session");
    }
	/**
	 * The debug adapter is about to receive a Debug Adapter Protocol message from the editor.
	 */
	onWillReceiveMessage?(message: any): void {
    }
	/**
	 * The debug adapter has sent a Debug Adapter Protocol message to the editor.
	 */
	onDidSendMessage?(message: any): void {
    }
	/**
	 * The debug adapter session is about to be stopped.
	 */
	onWillStopSession?(): void {
		console.log("Stop session");
	}
	/**
	 * An error with the debug adapter has occurred.
	 */
	onError?(error: Error): void {}
	/**
	 * The debug adapter has exited with the given exit code or signal.
	 */
	onExit?(code: number | undefined, signal: string | undefined): void {}
}
