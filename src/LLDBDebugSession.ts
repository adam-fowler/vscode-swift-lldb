import * as cp from "child_process";

export class LLDBDebugSession {
    constructor(
        public dapExecutable: string
    ) {}

    run(streamIn: NodeJS.ReadableStream, streamOut: NodeJS.WritableStream) {
        return new Promise<void>((resolve, reject) => {
            const p = cp.execFile(this.dapExecutable, [], {}, error => {
                if (error) {
                    reject({ error });
                } else {
                    resolve();
                }
            });
			if (p.stdin) {
				streamIn.pipe(p.stdin);
			}
			if (p.stdout) {
				p.stdout.pipe(streamOut);
			}
			process.on('SIGTERM', () => {
				p.kill('SIGTERM');
			});
        });
    
    }
}