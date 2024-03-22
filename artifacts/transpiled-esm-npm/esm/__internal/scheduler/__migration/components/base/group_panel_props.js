export var GroupPanelBaseDefaultProps = {
  groupPanelData: {
    groupPanelItems: [],
    baseColSpan: 1
  },
  groupByDate: false,
  styles: {}
};
export var GroupPanelCellDefaultProps = {
  id: 0,
  text: '',
  data: Object.freeze({
    id: 0
  }),
  className: ''
};
export var GroupPanelRowDefaultProps = {
  groupItems: Object.freeze([]),
  className: ''
};