"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const migrations_1 = require("@mikro-orm/migrations");
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const path_1 = __importDefault(require("path"));
const config = {
    dbName: 'lireddit',
    debug: !constants_1.__prod__,
    type: 'postgresql',
    entities: [Post_1.Post],
    migrations: {
        tableName: 'mikro_orm_migrations',
        path: path_1.default.join(__dirname, './migrations'),
        pathTs: undefined,
        glob: '!(*.d).{js,ts}',
        transactional: true,
        disableForeignKeys: true,
        allOrNothing: true,
        dropTables: true,
        safe: false,
        snapshot: true,
        emit: 'ts',
        generator: migrations_1.TSMigrationGenerator,
    },
};
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map