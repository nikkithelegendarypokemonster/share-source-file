/**
* DevExtreme (localization/message.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
type messageLocalizationType = {
    getFormatter(name: string): () => string;
    format(name: string): string;
};
declare const messageLocalization: messageLocalizationType;
export default messageLocalization;
