"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
// const bookRoutes = require("./routes/book-routes") 
const auth_routes_1 = require("./routes/auth-routes");
const wallet_routes_1 = require("./routes/wallet-routes");
const apikey_routes_1 = require("./routes/apikey-routes");
const db_1 = require("./database/db");
const corsConfig_1 = require("./middleware/corsConfig");
const rateLimiting_1 = require("./middleware/rateLimiting");
const errorHandler_1 = require("./middleware/errorHandler");
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const port = process.env.PORT;
const app = (0, express_1.default)();
app.set("trust proxy", 1);
app.use((0, helmet_1.default)());
app.use((0, connect_timeout_1.default)("60s"));
app.use((0, corsConfig_1.configureCors)());
app.use((0, rateLimiting_1.ratelimitingGeneral)(100, 15 * 60 * 1000));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/auth", auth_routes_1.router);
app.use("/api/wallet", wallet_routes_1.router);
app.use("/api/apikey", apikey_routes_1.router);
app.use(errorHandler_1.errorHandler);
function runServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.connectToDB)();
            app.listen(port, () => {
                console.log(`Server running on port ${port}`);
            });
        }
        catch (error) {
            console.error("MongoDB connection error:", error);
        }
    });
}
runServer();
