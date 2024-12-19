import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/**/*.{js,ts,jsx,tsx}",
  'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
];
export const theme = {
  extend: {},
};
export const plugins = [
  flowbitePlugin
];


// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./src/**/*.{js,ts,jsx,tsx}", // JSX 파일 추가
//     'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}' // 이 줄 추가
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     require('flowbite/plugin') // 이 줄 추가
//   ],
// }
