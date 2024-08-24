
  import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
export async function GET(request) {
const query = request.nextUrl.searchParams.get("query")

// Replace the uri string with your connection string.
const uri =  "mongodb+srv://srishti2:T3D9IAJ1rcLLbNFo@cluster.jqane76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";
const client = new MongoClient(uri);
  try {
    const database = client.db('Stock');
    const inventory = database.collection('inventory');
   
    const products = await inventory.aggregate([
        {
          $match: {
            $or: [
              { slug: { $regex: query, $options: "i" } }, // Case-insensitive regex match for name
              
            ]
          }
        }
      ]).toArray()

    
    return NextResponse.json({success: true, products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}






