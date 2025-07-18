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
exports.StartServer = void 0;
const expressApp_1 = __importDefault(require("./expressApp"));
const PORT = process.env.PORT || 8000;
const StartServer = () => __awaiter(void 0, void 0, void 0, function* () {
    expressApp_1.default.listen(PORT, () => {
        console.log(`App is listening to ${PORT}`);
    });
    process.on("uncaughtException", (err) => {
        console.error("Uncaught Exception:", err);
        process.exit(1); // Exit the process with failure
    });
});
exports.StartServer = StartServer;
(0, exports.StartServer)()
    .then(() => {
    console.log("Server started successfully");
})
    .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1); // Exit the process with failure
});
