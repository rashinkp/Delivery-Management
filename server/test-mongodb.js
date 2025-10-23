const mongoose = require('mongoose');

async function testMongoConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wholesale_delivery_db';
  
  console.log('🔗 Testing MongoDB connection...');
  console.log(`📍 URI: ${uri}`);
  
  try {
    // Set connection timeout
    const connectionTimeout = setTimeout(() => {
      console.log('⏰ Connection timeout after 10 seconds');
      process.exit(1);
    }, 10000);

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    clearTimeout(connectionTimeout);
    
    console.log('✅ MongoDB connection successful!');
    console.log(`📊 Connection State: ${mongoose.connection.readyState}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    console.log(`🗄️ Database: ${mongoose.connection.name}`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📋 Collections: ${collections.length} found`);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    console.error('💡 Troubleshooting:');
    console.error('   1. Check if MongoDB is running: netstat -an | findstr :27017');
    console.error('   2. Try connecting with MongoDB Compass or mongo shell');
    console.error('   3. Check MongoDB logs');
    process.exit(1);
  }
}

testMongoConnection();
