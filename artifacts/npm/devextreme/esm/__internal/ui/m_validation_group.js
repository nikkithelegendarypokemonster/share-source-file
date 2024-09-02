/**
* DevExtreme (esm/__internal/ui/m_validation_group.js)
* Version: 24.2.0
* Build date: Fri Aug 30 2024
*
* Copyright (c) 2012 - 2024 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import registerComponent from '../../core/component_registrator';
import DOMComponent from '../../core/dom_component';
import $ from '../../core/renderer';
import ValidationEngine from './m_validation_engine';
import ValidationSummary from './m_validation_summary';
import Validator from './m_validator';
const VALIDATION_ENGINE_CLASS = 'dx-validationgroup';
const VALIDATOR_CLASS = 'dx-validator';
const VALIDATION_SUMMARY_CLASS = 'dx-validationsummary';
class ValidationGroup extends DOMComponent {
  _getDefaultOptions() {
    // @ts-expect-error
    return super._getDefaultOptions();
  }
  _init() {
    // @ts-expect-error
    super._init();
    ValidationEngine.addGroup(this, false);
  }
  _initMarkup() {
    const $element = this.$element();
    // @ts-expect-error
    $element.addClass(VALIDATION_ENGINE_CLASS);
    // @ts-expect-error
    $element.find(`.${VALIDATOR_CLASS}`).each((_, validatorContainer) => {
      Validator.getInstance($(validatorContainer))._initGroupRegistration();
    });
    // @ts-expect-error
    $element.find(`.${VALIDATION_SUMMARY_CLASS}`).each((_, summaryContainer) => {
      ValidationSummary.getInstance($(summaryContainer)).refreshValidationGroup();
    });
    // @ts-expect-error
    super._initMarkup();
  }
  validate() {
    return ValidationEngine.validateGroup(this);
  }
  reset() {
    return ValidationEngine.resetGroup(this);
  }
  _dispose() {
    ValidationEngine.removeGroup(this);
    // @ts-expect-error
    this.$element().removeClass(VALIDATION_ENGINE_CLASS);
    // @ts-expect-error
    super._dispose();
  }
  _useTemplates() {
    return false;
  }
}
registerComponent('dxValidationGroup', ValidationGroup);
export default ValidationGroup;
