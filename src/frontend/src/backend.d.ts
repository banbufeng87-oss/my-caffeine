import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Cell {
    value: Value;
    name: string;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface Pattern {
    id: PatternId;
    gridHeight: bigint;
    cells: Array<string>;
    name: string;
    createdAt: Timestamp;
    colorCount: bigint;
    totalBeads: bigint;
    gridWidth: bigint;
    colors: Array<PatternColor>;
}
export interface PatternColor {
    hex: string;
    code: string;
    count: bigint;
}
export type PatternError = {
    __kind__: "invalidInput";
    invalidInput: string;
} | {
    __kind__: "notAuthenticated";
    notAuthenticated: null;
} | {
    __kind__: "notFound";
    notFound: null;
};
export type PatternId = bigint;
export interface PatternInput {
    gridHeight: bigint;
    cells: Array<string>;
    name: string;
    colorCount: bigint;
    totalBeads: bigint;
    gridWidth: bigint;
    colors: Array<PatternColor>;
}
export interface PatternSummary {
    id: PatternId;
    gridHeight: bigint;
    name: string;
    createdAt: Timestamp;
    colorCount: bigint;
    totalBeads: bigint;
    gridWidth: bigint;
}
export type Result = {
    __kind__: "ok";
    ok: Pattern;
} | {
    __kind__: "err";
    err: PatternError;
};
export type Result_1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: PatternError;
};
export type Result_2 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface Result__1 {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Timestamp = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deletePattern(id: PatternId): Promise<Result_1>;
    execute(qJson: string): Promise<Result__1>;
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getPattern(id: PatternId): Promise<Result>;
    isCallerAdmin(): Promise<boolean>;
    listPatterns(): Promise<Array<PatternSummary>>;
    savePattern(input: PatternInput): Promise<Result>;
    schema(): Promise<string>;
}
