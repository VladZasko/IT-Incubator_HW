
export class RateLimiteType {
    constructor(
        public IP: string,
        public URL: string,
        public date: Date
    ) {
    }
}
