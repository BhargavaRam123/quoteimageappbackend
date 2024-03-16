import mongoose from "mongoose";
export async function connect() {
  try {
    const connectionInstance = await mongoose.connect(
      `mongodb+srv://bhargavaram:nt3ZQd8tuud0YuJf@cluster0.xcctykp.mongodb.net/quoteimageapp`
    );
    console.log("connected to mongodb");
  } catch (error) {
    console.log("error occured in connect function:", error.message);
    process.exit(1);
  }
}
