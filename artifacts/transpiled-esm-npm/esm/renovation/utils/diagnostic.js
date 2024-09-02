import { getWindow } from '../../core/utils/window';
export const DiagnosticUtils = {
  resolveMap: () => {
    const diagnosticWindow = getWindow();
    if (!diagnosticWindow.dxDiagnostic) {
      diagnosticWindow.dxDiagnostic = {};
    }
    return diagnosticWindow.dxDiagnostic;
  },
  getDiagnostic: key => {
    const diagnosticMap = DiagnosticUtils.resolveMap();
    if (!diagnosticMap[key]) {
      diagnosticMap[key] = {
        renderCount: 0
      };
    }
    return diagnosticMap[key];
  },
  incrementRenderCount: key => {
    const diagnostic = DiagnosticUtils.getDiagnostic(key);
    diagnostic.renderCount += 1;
  }
};