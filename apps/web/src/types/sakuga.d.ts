import * as React from 'react';

export interface SakugaButtonElement extends HTMLElement {
  done: () => void;
  disabled: boolean;
  type?: string;
  variant?: 'primary' | 'secondary';
}

export interface SakugaToggleElement extends HTMLElement {
  checked: boolean;
  disabled: boolean;
  label?: string;
}

export interface SakugaSliderElement extends HTMLElement {
  value: string | number;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  label?: string;
  disabled?: boolean;
}

export interface SakugaCheckboxElement extends HTMLElement {
  checked: boolean;
  disabled: boolean;
}

export interface SakugaRadioElement extends HTMLElement {
  value: string;
  label?: string;
  disabled?: boolean;
}

export interface SakugaInputElement extends HTMLElement {
  value: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
}

export interface SakugaTabsElement extends HTMLElement {
  selected: number;
  value: string;
  label?: string;
}

export interface SakugaProgressElement extends HTMLElement {
  set: (n: number) => void;
  label?: string;
  demo?: boolean;
}

export interface SakugaRatingElement extends HTMLElement {
  value: number;
  label?: string;
  disabled?: boolean;
}

export interface SakugaToastElement extends HTMLElement {
  show: (message: string, options?: { duration?: number }) => void;
}

export interface SakugaTooltipElement extends HTMLElement {
  text?: string;
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'sakuga-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'primary' | 'secondary';
          disabled?: boolean;
          type?: string;
          class?: string;
        },
        SakugaButtonElement
      >;
      'sakuga-toggle': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          checked?: boolean;
          disabled?: boolean;
          name?: string;
          class?: string;
        },
        SakugaToggleElement
      >;
      'sakuga-slider': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: number | string;
          min?: number | string;
          max?: number | string;
          step?: number | string;
          label?: string;
          name?: string;
          disabled?: boolean;
          class?: string;
        },
        SakugaSliderElement
      >;
      'sakuga-checkbox': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          checked?: boolean;
          disabled?: boolean;
          name?: string;
          class?: string;
        },
        SakugaCheckboxElement
      >;
      'sakuga-radio': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          name?: string;
          value?: string;
          disabled?: boolean;
          class?: string;
        },
        SakugaRadioElement
      >;
      'sakuga-input': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          placeholder?: string;
          value?: string;
          type?: string;
          name?: string;
          disabled?: boolean;
          class?: string;
        },
        SakugaInputElement
      >;
      'sakuga-tabs': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          selected?: number | string;
          class?: string;
        },
        SakugaTabsElement
      >;
      'sakuga-progress': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          demo?: boolean;
          class?: string;
        },
        SakugaProgressElement
      >;
      'sakuga-rating': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          value?: number | string;
          name?: string;
          disabled?: boolean;
          class?: string;
        },
        SakugaRatingElement
      >;
      'sakuga-toast': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          class?: string;
        },
        SakugaToastElement
      >;
      'sakuga-tooltip': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          text?: string;
          class?: string;
        },
        SakugaTooltipElement
      >;
    }
  }
}

declare global {
  interface Window {
    SakugaFX?: Record<string, unknown>;
    __sakuga_loaded__?: Set<string>;
  }

  namespace JSX {
    interface IntrinsicElements {
      'sakuga-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          variant?: 'primary' | 'secondary';
          disabled?: boolean;
          type?: string;
          class?: string;
        },
        SakugaButtonElement
      >;
      'sakuga-toggle': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          checked?: boolean;
          disabled?: boolean;
          name?: string;
          class?: string;
        },
        SakugaToggleElement
      >;
      'sakuga-slider': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          value?: number | string;
          min?: number | string;
          max?: number | string;
          step?: number | string;
          label?: string;
          name?: string;
          disabled?: boolean;
          class?: string;
        },
        SakugaSliderElement
      >;
      'sakuga-checkbox': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          checked?: boolean;
          disabled?: boolean;
          name?: string;
          class?: string;
        },
        SakugaCheckboxElement
      >;
      'sakuga-radio': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          name?: string;
          value?: string;
          disabled?: boolean;
          class?: string;
        },
        SakugaRadioElement
      >;
      'sakuga-input': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          placeholder?: string;
          value?: string;
          type?: string;
          name?: string;
          disabled?: boolean;
          class?: string;
        },
        SakugaInputElement
      >;
      'sakuga-tabs': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          selected?: number | string;
          class?: string;
        },
        SakugaTabsElement
      >;
      'sakuga-progress': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          demo?: boolean;
          class?: string;
        },
        SakugaProgressElement
      >;
      'sakuga-rating': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          label?: string;
          value?: number | string;
          name?: string;
          disabled?: boolean;
          class?: string;
        },
        SakugaRatingElement
      >;
      'sakuga-toast': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          class?: string;
        },
        SakugaToastElement
      >;
      'sakuga-tooltip': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          text?: string;
          class?: string;
        },
        SakugaTooltipElement
      >;
    }
  }
}
