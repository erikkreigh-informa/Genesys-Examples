const DEFAULT_PC_ENV_TLD = 'mypurecloud.com';
const PC_ENV_TLDS = [
    'mypurecloud.com',
    'mypurecloud.com.au',
    'mypurecloud.ie',
    'mypurecloud.jp',
    'mypurecloud.de',
    'usw2.pure.cloud',
    'euw2.pure.cloud',
    'cac1.pure.cloud',
    'apne2.pure.cloud'
];

export interface PcEnv {
    pcEnvTld: string;
    pcAppOrigin: string;
}

let DEFAULT_PC_ENV!: PcEnv;
const PC_ENVS = PC_ENV_TLDS.reduce<PcEnv[]>((result, currEnvTld) => {
    const currEnv: PcEnv = {
        pcEnvTld: currEnvTld,
        pcAppOrigin: `https://apps.${currEnvTld}`
    };

    if (currEnvTld === DEFAULT_PC_ENV_TLD) {
        DEFAULT_PC_ENV = currEnv;
    }

    result.push(currEnv);
    return result;
}, []);

export default {
    DEFAULT_PC_ENV,

    /**
     * Attempts to locate a PC environment corresponding to the provided search params
     *
     * @param pcEnvTld A string representing the PureCloud environment top-level domain to search for
     * @param lenient When true, trims leading/trailing whitespace, ignores leading '.', and ignores trailing '/'.
     *
     * @returns A PureCloud environment object if found; null otherwise.
     */
    lookupPcEnv(pcEnvTld: string, lenient = false): PcEnv | null {
        let result: PcEnv | null = null;

        if (pcEnvTld && typeof pcEnvTld === 'string') {
            let toSearch = pcEnvTld;

            if (lenient) {
                toSearch = toSearch.trim();

                if (toSearch.indexOf('.') === 0) {
                    toSearch = toSearch.substring(1);
                }

                if (toSearch.indexOf('/') === (toSearch.length - 1)) {
                    toSearch = toSearch.substring(0, toSearch.length - 1);
                }
            }

            PC_ENVS.forEach(currEnv => {
                if (!result && currEnv.pcEnvTld === toSearch) {
                    result = currEnv;
                }
            });
        }

        return result;
    }
};
