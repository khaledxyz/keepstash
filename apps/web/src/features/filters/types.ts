export interface FilterOption {
  label: string;
  value: string;
}

export interface DatePreset {
  label: string;
  getValue: () => { from: Date; to: Date };
}
