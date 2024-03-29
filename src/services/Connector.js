import { invoke } from '@tauri-apps/api/tauri';

class Connector {
    opts = {};

    constructor(opts) {
        this.opts = opts;
    }

    get dbHost() {
        return this.opts?.driverOpts?.host;
    }

    get type() {
        return this.opts?.driverName;
    }

    get connectOpts() {
        return {
            ...this.opts,
            driverOpts: {
                driver: this.opts.driverName,
                ...this.opts.driverOpts,
                host: this.opts.driverOpts?.host ?? '',
                port: Number(this.opts.driverOpts?.port ?? 0),
                user: this.opts.driverOpts?.user ?? '',
            },
            sshOpts: {
                host: this.opts.sshOpts?.host ?? '',
                port: Number(this.opts.sshOpts?.port ?? 22),
                user: this.opts.sshOpts?.user ?? '',
                password: this.opts.sshOpts?.password ?? '',
                keyfile: this.opts.sshOpts?.keyfile ?? undefined,
            }
        }
    }

    setDatabase() { throw Error('setDatabase not implemented') }
    getDatabase() { throw Error('getDatabase not implemented') }
    async loadDatabases() { throw Error('loadDatabases not implemented') }
    async loadTables() { throw Error('loadTables not implemented') }

    /**
     * Tells the rust-end to create a connection. Internally, this is bound to the window.
     */
    async connect() {
        return await invoke('connect', this.connectOpts);
    }

    /**
     * Tells the rust-end connection to disconnect
     */
    async disconnect() {
        return await invoke('disconnect');
    }

    /**
     * Tests the connection info
     */
    async test() {
        const opts = structuredClone(this.connectOpts);
        console.log('test_connection', opts);
        return await invoke('test_connection', opts);
    }

    /**
     * Runs a query
     * @TODO add "cancel" capability
     * @param {String} query
     * @param {String} schema -- optional
     */
    async query(query, database) {
        console.log({ query, database });
        return invoke('query', { query, database });
    }
}

export { Connector };