/* --------------------------------------------------------------------------------------------
 * Copyright (c) TypeFox and others. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import { RequestType, RequestHandler } from 'vscode-jsonrpc';
import { DocumentSymbol as LspDocumentSymbol, Location } from 'vscode-languageserver-types';
import * as lsp from 'vscode-languageserver';

export interface CallsClientCapabilities {
    /**
     * The text document client capabilities
     */
    textDocument?: {
        /**
         * Capabilities specific to the `textDocument/calls`
         */
        calls?: {
            /**
             * Whether implementation supports dynamic registration. If this is set to `true`
             * the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
             * return value for the corresponding server capability as well.
             */
            dynamicRegistration?: boolean;
        };
    }
}

export interface CallsServerCapabilities {
    /**
     * The server provides Call Hierarchy support.
     */
    callsProvider?: boolean | (lsp.TextDocumentRegistrationOptions & lsp.StaticRegistrationOptions);
}

/**
 * A request to resolve all calls at a given text document position of a symbol definition or a call the same.
 * The request's parameter is of type [CallsParams](#CallsParams), the response is of type [CallsResult](#CallsResult) or a
 * Thenable that resolves to such.
 */
export namespace CallsRequest {
    export const type = new RequestType<CallsParams, CallsResult, void, lsp.TextDocumentRegistrationOptions>('textDocument/calls');
    export type HandlerSignature = RequestHandler<CallsParams, CallsResult | null, void>;
}

/**
 * The parameters of a `textDocument/calls` request.
 */
export interface CallsParams extends lsp.TextDocumentPositionParams {
    /**
     * Outgoing direction for callees.
     * The default is incoming for callers.
     */
    direction?: CallDirection;
}

/**
 * Enum of call direction kinds
 */
export enum CallDirection {
    /**
     * Incoming calls aka. callers
     */
    Incoming = "incoming",
    /**
     * Outgoing calls aka. callees
     */
    Outgoing = "outgoing",
}

/**
 * The result of a `textDocument/calls` request.
 */
export interface CallsResult {
    /**
     * The symbol of a definition for which the request was made.
     *
     * If no definition is found at a given text document position, the symbol is undefined.
     */
    symbol?: DocumentSymbol;
    /**
     * List of calls.
     */
    calls: Call[];
}

export type DocumentSymbol = LspDocumentSymbol & { uri?: string; };

/**
 * Represents a directed call.
 *
 *
 */
export interface Call {
    /**
     * Actual location of a call to a definition.
     */
    location: Location;
    /**
     * Symbol refered to by this call. For outgoing calls this is a callee,
     * otherwise a caller.
     */
    symbol: DocumentSymbol;
}
