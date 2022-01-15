
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
	input: 'src/main.js',
	output: [{
		file: 'dist/main.js',
		format: 'iife'
	},
	{
		file: 'dist/main.min.js',
		format: 'iife',
		name: 'version',
		plugins: [terser()]
	}
	],
	plugins: [ json() ]
};

