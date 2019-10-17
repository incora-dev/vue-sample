import _ from 'lodash'

export default {
  TOAST_TYPE: {
    SUCCESS: "success",
    INFO: 'info',
    WARNING: 'warning',
    ERROR: "error",
  },
  BILLING_EVENT_TYPE: {
    TIME: { label: 'Time', value: 'Entry::TimeEvent', icon: 'timer' },
    EXPENSE: { label: 'Expense', value: 'Entry::ExpenseEvent', icon: 'attach_money' },
    getLabel(value) {
      return _.find(this, function(obj) { return obj.value === value; }).label;
    },
    getIcon(value) {
      return _.find(this, function(obj) { return obj.value === value; }).icon;
    }
  }
}
