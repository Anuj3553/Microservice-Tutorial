import expressApp from './expressApp'

const PORT = process.env.PORT || 8000;

export const StartServer = async () => {

    expressApp.listen(PORT, () => {
        console.log(`App is listening to ${PORT}`);
    });

    process.on("uncaughtException", (err) => {
        console.error("Uncaught Exception:", err);
        process.exit(1); // Exit the process with failure
    });
}

StartServer()
    .then(() => {
        console.log("Server started successfully");
    })
    .catch((err) => {
        console.error("Error starting server:", err);
        process.exit(1); // Exit the process with failure
    });