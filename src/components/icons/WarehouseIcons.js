import { defineComponent, h } from 'vue';

const classesProp = {
  classes: {
    type: String,
    default: 'w-6 h-6',
  },
};

export const ToteIcon = defineComponent({
  name: 'ToteIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' })],
      ),
});

export const BinIcon = defineComponent({
  name: 'BinIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m0 0v10l8 4m0-14L4 7',
          }),
        ],
      ),
});

export const CheckIcon = defineComponent({
  name: 'CheckIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M5 13l4 4L19 7' })],
      ),
});

export const ScanIcon = defineComponent({
  name: 'ScanIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 4v16m8-8H4' }),
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M3 6.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2zM3 15.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2zM18.5 6a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5h-2zM18.5 15a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5h-2z',
          }),
        ],
      ),
});

export const LoadingSpinner = defineComponent({
  name: 'LoadingSpinner',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          class: `${props.classes} animate-spin`,
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
        },
        [
          h('circle', { class: 'opacity-25', cx: '12', cy: '12', r: '10', stroke: 'currentColor', 'stroke-width': '4' }),
          h('path', {
            class: 'opacity-75',
            fill: 'currentColor',
            d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z',
          }),
        ],
      ),
});

export const BoxIcon = defineComponent({
  name: 'BoxIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M20 7l-8-4-8 4m16 0v10l-8 4m0-14L4 7m0 0v10l8 4m0-14L4 7m12 10l-8-4',
          }),
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 12l8 4 8-4' }),
        ],
      ),
});

export const TruckIcon = defineComponent({
  name: 'TruckIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' }),
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M13 17H6V6h10v4l4 4H13z' }),
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M6 17H4a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v5.5' }),
        ],
      ),
});

export const ArrowLeftIcon = defineComponent({
  name: 'ArrowLeftIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 19l-7-7 7-7' })],
      ),
});

export const DotsVerticalIcon = defineComponent({
  name: 'DotsVerticalIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z' })],
      ),
});

export const MenuIcon = defineComponent({
  name: 'MenuIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 6h16M4 12h16M4 18h16' })],
      ),
});

export const XIcon = defineComponent({
  name: 'XIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M6 18L18 6M6 6l12 12' })],
      ),
});

export const LockIcon = defineComponent({
  name: 'LockIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' })],
      ),
});

export const ChevronDownIcon = defineComponent({
  name: 'ChevronDownIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M19 9l-7 7-7-7' })],
      ),
});

export const ExpandIcon = defineComponent({
  name: 'ExpandIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' }),
        ],
      ),
});

export const BackspaceIcon = defineComponent({
  name: 'BackspaceIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z' })],
      ),
});

export const SearchIcon = defineComponent({
  name: 'SearchIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' })],
      ),
});

export const InformationCircleIcon = defineComponent({
  name: 'InformationCircleIcon',
  props: classesProp,
  setup: (props) =>
    () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
          class: props.classes,
        },
        [
          h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }),
        ],
      ),
});




