//===----------------------------------------------------------------------===//
//
// This source file is part of the VSCode Swift open source project
//
// Copyright (c) 2021 the VSCode Swift project authors
// Licensed under Apache License v2.0
//
// See LICENSE.txt for license information
// See CONTRIBUTORS.txt for the list of VSCode Swift project authors
//
// SPDX-License-Identifier: Apache-2.0
//
//===----------------------------------------------------------------------===//

import * as vscode from "vscode";

/**
 * Type-safe wrapper around configuration settings.
 */
const configuration = {
    /** Path to folder that include swift executable */
    get swiftPath(): string {
        return vscode.workspace.getConfiguration("swift").get<string>("path", "");
    },
};

export default configuration;
