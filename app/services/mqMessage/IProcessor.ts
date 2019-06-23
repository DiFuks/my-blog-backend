export interface IProcessor {
    process(data: any): Promise<void>;
}
