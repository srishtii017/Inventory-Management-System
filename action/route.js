import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
export async function POST(request) {  
    let { action, slug, initialQuantity } = await request.json();  
     

//     // Validate incoming data  
//     if (!action || !slug || typeof initialQuantity === 'undefined') {  
//         return NextResponse.json({ success: false, message: 'Missing required parameters' });  
//     }  

     const uri ="mongodb+srv://srishti2:T3D9IAJ1rcLLbNFo@cluster.jqane76.mongodb.net/?retryWrites=true&w=majority&appName=Cluster";
    const client = new MongoClient(uri);  
    
   try {  
//         await client.connect();  // Ensure you connect before using  
       const database = client.db('Stock');  
       const inventory = database.collection('inventory');  
        
        const filter = { slug:slug };  
         let newQuantity = action === "plus" ? (Number(initialQuantity) + 1) : (Number(initialQuantity) - 1);  

//         // Ensure new quantity calculation is valid  
        if (newQuantity < 0) {  
             return NextResponse.json({ success: false, message: 'Quantity cannot be negative' });  
        }  

        const updateDoc = { $set: { quantity: newQuantity } };  
       const result = await inventory.updateOne(filter, updateDoc,{}); 
      // console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,);  


       return NextResponse.json({ success: true, message: `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)` });  
//     } catch (error) {  
//         console.error('Error occurred:', error);  // Log the full error  
//         return NextResponse.json({ success: false, message: error.toString() });  
    } finally {  
        await client.close();  
    }  
}