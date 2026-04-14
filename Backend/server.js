import "dotenv/config"
import app from "./src/app.js"
import connectToDB from "./src/Config/database.js";



connectToDB()


app.listen(3000, ()=>{
    console.log("Server is running at port 3000");
}) 