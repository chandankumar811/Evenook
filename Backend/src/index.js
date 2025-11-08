// const db = require("./db.js");
import dotenv from "dotenv";
import {app} from "./app.js";

dotenv.config({
    path: "./.env",
});

// db()
//     .then(() => {
//         app.listen(process.env.PORT || 8000, () => {
//             console.log(`Server is running on PORT: ${process.env.PORT}`);
//         });
//     })
//     .catch((error) => {
//         console.log("Database connection failed", error);
//         process.exit(1);
//     });

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on PORT: ${process.env.PORT}`);
});