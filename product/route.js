import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  const uri = "mongodb+srv://srishti2:T3D9IAJ1rcLLbNFo@cluster.jqane76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('Stock');
    const inventory = database.collection('inventory');

    const products = await inventory.find({}).toArray();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.error('Failed to fetch products', { status: 500 });
  } finally {
    await client.close();
  }
}


export async function POST(request) {
  let body;
  try {
    body = await request.json();
    console.log('Received request body:', body);
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.error('Invalid JSON', { status: 400 });
  }

  const uri ="mongodb+srv://srishti2:T3D9IAJ1rcLLbNFo@cluster.jqane76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('Stock');
    const inventory = database.collection('inventory');

    const { slug, quantity, price } = body.productForm;

    if (!slug || !quantity || !price) {
      throw new Error('Missing required fields');
    }

    const newDocument = {
      slug,
      quantity,
      price,
    };

    const product = await inventory.insertOne(newDocument);
    return NextResponse.json({ product, ok: true });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.error(error.message, { status: 500 });
  } finally {
    await client.close();
  }
}








