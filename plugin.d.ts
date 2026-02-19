import { PluginCreator, Rule, AtRule } from "postcss";


export interface PluginOptions {
    variantOrder?: string[];
}

export interface ThemeItem {
    type: string;
    key: string;
    value: string;
}

export interface UtilityProperty {
    prop: string;
    value: string;
}

export interface UtilityRule {
    selector: string;
    variants: string[];
    properties: UtilityProperty[];
}

export interface Utility {
    name: string;
    variants: string[];
    rules: UtilityRule[];
}

/**
 * Get the selector for the specified variant.
 * @param variant - variant to get the selector for.
 * @param selector - selector to replace.
 * @returns selector - selector to replace.
 */
export function getSelector(variant?: string, selector?: string): string;

/**
 * Compile a utility object into PostCSS rules.
 * @param utility - utility object to compile.
 * @param theme - theme object to use for compilation.
 * @param postcss - postcss instance to use for compilation.
 * @param options - optional configuration for the compilation.
 * @returns compiled rules.
 */
export function compileUtility(
    utility: Utility,
    theme: ThemeItem[],
    postcss: any,
    options?: PluginOptions
): (Rule | AtRule)[];

/**
 * Parse a theme rule.
 * @param rule - theme rule.
 * @param themeMap - map to store theme variables.
 */
export function parseTheme(rule: AtRule, themeMap: Map<string, ThemeItem>): void;

/**
 * Parse a utility rule.
 * @param rule - utility rule.
 * @returns parsed utility rule.
 */
export function parseUtility(rule: AtRule): Utility;

/**
 * PostCSS plugin to generate lowcss styles.
 */
declare const lowCssPlugin: PluginCreator<PluginOptions> & { postcss: true };

export default lowCssPlugin;

