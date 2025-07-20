// eslint.config.js
import angularEslintPlugin from '@angular-eslint/eslint-plugin';
import angularEslintTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularEslintTemplateParser from '@angular-eslint/template-parser';
import tsParser from '@typescript-eslint/parser';

export default [
    // Global ignores
    {
        ignores: ['src/@fuse/**/*']
    },

    // TypeScript files configuration
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: ['tsconfig.json'],
                createDefaultProgram: true
            }
        },
        plugins: {
            '@angular-eslint': angularEslintPlugin
        },
        rules: {
            ...angularEslintPlugin.configs.recommended.rules,
            '@angular-eslint/component-class-suffix': [
                'error',
                {
                    suffixes: ['Component']
                }
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'sia',
                    style: 'kebab-case'
                }
            ],
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'sia',
                    style: 'camelCase'
                }
            ],
            'semi': 'error',
            'quote-props': ['error', 'consistent'],
            'quotes': ['error', 'single']
        }
    },

    // HTML template files configuration
    {
        files: ['**/*.html'],
        languageOptions: {
            parser: angularEslintTemplateParser
        },
        plugins: {
            '@angular-eslint/template': angularEslintTemplatePlugin
        },
        rules: {
            ...angularEslintTemplatePlugin.configs.recommended.rules
        }
    }
];
