/**
* DevExtreme (file_management/remote_provider.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import FileSystemProviderBase, {
    FileSystemProviderBaseOptions,
} from './provider_base';

/** @public */
export type Options = RemoteFileSystemProviderOptions;

/**
 * @deprecated Use Options instead
 * @namespace DevExpress.fileManagement
 * @docid
 */
export interface RemoteFileSystemProviderOptions extends FileSystemProviderBaseOptions<RemoteFileSystemProvider> {
    /**
     * @docid
     * @type_function_param1_field headers:object
     * @type_function_param1_field xhrFields:object
     * @type_function_param1_field formData:object
     * @public
     */
    beforeAjaxSend?: ((options: { headers?: any; xhrFields?: any; formData?: any }) => void);
    /**
     * @docid
     * @type_function_param1_field formData:object
     * @public
     */
    beforeSubmit?: ((options: { formData?: any }) => void);
    /**
     * @docid
     * @public
     */
    endpointUrl?: string;
    /**
     * @docid
     * @public
     */
    hasSubDirectoriesExpr?: string | Function;
    /**
     * @docid
     * @default {}
     * @public
     */
    requestHeaders?: any;
}
/**
 * @docid
 * @inherits FileSystemProviderBase
 * @namespace DevExpress.fileManagement
 * @public
 * @options RemoteFileSystemProviderOptions
 */
export default class RemoteFileSystemProvider extends FileSystemProviderBase {
    constructor(options?: Options);
}
