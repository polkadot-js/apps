interface TOptions {
    ns?: string;
    replace?: Record<string, unknown>;
}
export declare function useTranslation(): {
    t: (key: string, optionsOrText?: string | TOptions, options?: TOptions) => string;
};
export {};
