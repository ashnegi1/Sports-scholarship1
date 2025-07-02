// Connect to MongoDB or MongoDB Memory Server
const connectDB = async () => {
  try {
    console.log(Using memory DB? );

    // Check if we should use the in-memory database
    if (config.USE_MEMORY_DB) {
      console.log('Initializing MongoDB Memory Server');
      const { mongoUri } = await startMongoMemoryServer();
      console.log(MongoDB Memory Server URI: );

      // Seed the database with default users
      await seedDefaultUsers();
    } else {
      // First try to connect to MongoDB Atlas
      try {
        const atlasUri = 'mongodb+srv://sahnikush267:EIL%4012345@cluster0.2vipzio.mongodb.net/sports_scholarship?retryWrites=true&w=majority&appName=Cluster0';
        console.log(Attempting to connect to MongoDB Atlas...);
        const conn = await mongoose.connect(atlasUri);
        console.log(MongoDB Atlas Connected: );
        
        // Seed the database with default users
        await seedDefaultUsers();
        return;
      } catch (atlasError) {
        console.log('MongoDB Atlas connection failed. Falling back to local MongoDB...');
        console.error(Atlas Error: );
      }
      
      // Connect to regular local MongoDB instance as fallback
      try {
        const localUri = 'mongodb://localhost:27017/sports_scholarship';
        console.log(Attempting to connect to local MongoDB at: );
        const conn = await mongoose.connect(localUri);
        console.log(Local MongoDB Connected: );

        // Also seed the regular database if needed
        await seedDefaultUsers();
      } catch (localError) {
        console.error('Error connecting to local MongoDB:', localError.message);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('Error during database connection:', error.message);
    console.error(error);
    process.exit(1);
  }
};
