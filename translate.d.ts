interface TOptions {
    ns?: string;
    replace?: Record<string, unknown>;
}
interface Translation {
    t: (key: string, optionsOrText?: string | TOptions, options?: TOptions) => string;
}
export declare function useTranslation(): Translation;
export {};
