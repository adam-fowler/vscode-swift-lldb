import * as path from "path";
import configuration from "./configuration";

/**
 * Get the file name of executable
 *
 * @param exe name of executable to return
 */
export function getExecutableName(exe: string): string {
    return process.platform === "win32" ? `${exe}.exe` : exe;
}

/**
 * Get path to swift executable, or executable in swift bin folder
 *
 * @param exe name of executable to return
 */
export function getSwiftExecutable(exe = "swift"): string {
    return path.join(configuration.swiftPath, getExecutableName(exe));
}

