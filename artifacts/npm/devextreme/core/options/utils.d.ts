/**
* DevExtreme (core/options/utils.d.ts)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import {
    Device,
} from '../devices';

import {
    DefaultOptionsRule,
} from '../options';

export {
    DefaultOptionsRule,
} from '../options';

export function convertRulesToOptions<T>(rules: DefaultOptionsRule<T>[]): T;

export function normalizeOptions(options: string | object, value: any): { [name: string]: string };

export function deviceMatch(device: Device, filter: any): boolean;

export function getFieldName(fullName: string): string;

export function getParentName(fullName: string): string;

export function createDefaultOptionRules<T>(options?: DefaultOptionsRule<T>[]): DefaultOptionsRule<T>[];
