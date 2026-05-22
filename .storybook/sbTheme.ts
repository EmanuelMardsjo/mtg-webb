import { create } from '@storybook/theming/create'

export default create({
  base: 'light',
  brandTitle: 'Move to Gothenburg — Foundations',
  colorPrimary: '#0A1020',
  colorSecondary: '#7C9BBE',

  appBg:        '#FBF8F3',
  appContentBg: '#FBF8F3',
  appBorderColor: 'rgba(10,16,32,0.10)',
  appBorderRadius: 0,

  textColor:        '#121A2E',
  textInverseColor: '#FBF8F3',

  barTextColor:       '#1B2740',
  barSelectedColor:   '#0A1020',
  barBg:              '#F5EFE5',

  inputBg:           '#FFFFFF',
  inputBorder:       'rgba(10,16,32,0.14)',
  inputTextColor:    '#0A1020',
  inputBorderRadius: 2,

  fontBase: `'Satoshi', 'Inter', system-ui, sans-serif`,
  fontCode: 'ui-monospace, SFMono-Regular, monospace'
})
