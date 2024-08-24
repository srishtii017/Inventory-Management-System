"use client"
import Header from '@/components/Header';
import { Fira_Sans_Extra_Condensed } from 'next/font/google';
import Image from 'next/image'
import { useState, useEffect } from 'react';

export default function Home() {


  const [productForm, setProductForm] = useState({})
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingaction, setLoadingaction] = useState(false);
  const [dropdown, setDropdown] = useState([])


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const rjson = await response.json();
        if (!rjson || !rjson.products) {
          throw new Error('Empty response or missing products');
        }
        setProducts(rjson.products);
      } catch (error) {
        console.error('Error fetching products:', error);
        console.error("Error details:", error.message, error.stack);
        // Handle error (e.g., setProducts([]) or show error message)
      }
    };

    fetchProducts();
  }, []);

  const buttonAction = async (action, slug, initialQuantity) => {
    //immediately change the quantity of the product with given slug in products
    let index = products.findIndex((item) => item.slug == slug)
    console.log(index)
    let newProducts = JSON.parse(JSON.stringify(products))
    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1
      console.log(newProducts[index].quantity)
    }
    else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1
    }
    setProducts(newProducts)
    // immediately change the quantity of the product with given slug in dropdown

    let indexdrop = dropdown.findIndex((item) => item.slug == slug)
    console.log(indexdrop, "parse")
    let newDropdown = JSON.parse(JSON.stringify(dropdown))
    if (action == "plus") {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1
      console.log(newDropdown[indexdrop].quantity)
    }
    else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1
    }
    setDropdown(newDropdown)

    console.log(action, slug)
    setLoadingaction(true)
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, slug, initialQuantity })
    });
    let r = await response.json()
    console.log(r)

    setLoadingaction(false)
  };



  {/* const buttonAction = async (action, slug, initialQuantity) => {  
    console.log(action, slug); // Log the action and slug parameters.  

    setLoadingaction(true); // Set loading state  

    try {  
        const response = await fetch('/api/product', {  
            method: 'POST',  
            headers: {  
                'Content-Type': 'application/json'  
            },  
            body: JSON.stringify({ action, slug, initialQuantity }) // Send the request body as JSON  
        });  

        // Check if the response is ok (status in the range 200-299)  
        if (!response.ok) {  
            const errorResponse = await response.json();  
            console.error('Error response from server:', errorResponse);  
            throw new Error(`HTTP error! status: ${response.status}`);  
        }  

        const data = await response.json(); // Parse the JSON response  
        console.log(data); // Log the response data  

        // Handle success response here if needed  
    } catch (error) {  
        console.error('Error during fetch:', error); // Log any errors that occur during the fetch  
    } finally {  
        setLoadingaction(false); // Always set loading to false when done  
    } */}





  const addProduct = async (e) => {
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productForm })
      });

      if (response.ok) {
        console.log('Product added successfully');
        setAlert("Your Product has been added!")
        setProductForm({})
      }
      else {
        console.error('Error adding Product');

      }

    } catch (error) {
      console.error('Error:', error);
    }
    // fetch all the products again to sync back
    const response = await fetch('/api/product')
    let rjson = await response.json()
    setProducts(rjson.products)
    e.preventDefault();




  }
  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value })
  }

  const onDropdownEdit = async (e) => {
    let value = e.target.value
    setQuery(value)
    if (value.length > 3) {
      setLoading(true)
      setDropdown([])
      const response = await fetch('/api/search?query=' + query)
      let rjson = await response.json()
      setDropdown(rjson.products)
      setLoading(false)
    }
    else {
      setDropdown([])
    }
  }

  return (
    <>
      <Header />
      <div className="container mx-auto my-8">
        <div className='text-pink-800 text-center'>{alert}</div>

        <h1 className="text-3xl font-semibold text-center mt-8 mb-4">Search a Product</h1>
        <div className="w-full flex justify-center items-center mb-2">
          <input onChange={onDropdownEdit}
            type="text"
            className="w-45 sm:w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mr-2 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            placeholder="Search Product..."
          />

          <select
            className="bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          >
            <option value="all">All</option>
            <option value="lowStock">Low Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>
        {loading && <div className='flex justify-center items-center'> <svg fill="#000000" height="250px" width="250px" version="1.1" id="Layer_1" viewBox="0 0 330 330" >
          <circle className="spinner-path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="#000" strokeDasharray="31.415, 31.415" strokeDashoffset="0">
            <animate attributeName="strokeDashoffset" repeatCount="indefinite" dur="1.5s" from="0" to="62.83" />
            <animate attributeName="strokeDasharray" repeatCount="indefinite" dur="1.5s" values="31.415, 31.415; 0, 62.83; 31.415, 31.415" />
          </circle>
        </svg></div>
        }
        <div className="dropcontainer absolute w-[80vw] border-1 bg-blue-200 rounded-md" >
          {dropdown.map(item => {
            return <div key={item.slug} className="container flex justify-between p-1 my-1 border-b-2">
              <span className="slug"> {item.slug} ({item.quantity} available for ₹{item.price})</span>
              <div className='mx-5'>
                <button onClick={() => { buttonAction("minus", item.slug, item.quantity) }} disabled={loadingaction} className="subtract inline-block px-3 py-1 cursor-pointer bg-blue-800 text-black font-semibold rounded-lg shadow-md disabled:bg-white-400"> - </button>

                <span className="quantity inline-block min-w-5 mx-3">{item.quantity}</span>
                <button onClick={() => { buttonAction("plus", item.slug, item.quantity) }} disabled={loadingaction} className="add inline-block px-3 py-1 cursor-pointer bg-blue-800 text-black font-semibold rounded-lg shadow-md disabled:bg-white-400"> + </button>
              </div></div>
          })}
        </div></div>
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold mb-6 my-8">Add a Product</h1>
        <div className="mt-4">
          <form className="w-full max-w-lg">
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="product-name">
                  Product Slug
                </label>
                <input value={productForm?.slug || ""} name='slug' onChange={handleChange} type="text" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="product-slug" placeholder="Product Slug" />
              </div>
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="quantity">
                  Quantity
                </label>
                <input value={productForm?.quantity || ""} name='quantity' onChange={handleChange} type="number" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="quantity" placeholder="Quantity" />
              </div>
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="price">
                  Price
                </label>
                <input value={productForm?.price || ""} name='price' onChange={handleChange} type="number" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="quantity" placeholder="Quantity" />
              </div>

            </div>
            <div className="flex items-center justify-end">
              <button onClick={addProduct} type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div> <div className="container my-6 mx-auto">

        <h1 className="text-3xl font-semibold text-center mt-8 mb-6 my-8 ">Display Current Stock</h1>
        <div className="mt-4">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-md overflow-hidden">
            <thead className="bg-gray-50">
              <tr>

                <th className="py-2 px-4 border-b border-red-800">Product Slug</th>
                <th className="py-2 px-4 border-b border-red-800">Quantity</th>
                <th className="py-2 px-4 border-b border-red-800">Price(in rupee)</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data*/}
              {products.map(product => {
                return <tr key={product.slug}>
                  <td className="py-2 px-4 border-b border-gray-200">{product.slug}</td>
                  <td className="py-2 px-4 border-b border-gray-200">{product.quantity}</td>
                  <td className="py-2 px-4 border-b border-gray-200">₹{product.price}</td>
                </tr>
              })}






              {/*
              <tr>
                <td className="border px-4 py-2">1</td>
                <td className="border px-4 py-2">Product A</td>
                <td className="border px-4 py-2">10</td>
                <td className="border px-4 py-2">2600</td>
              </tr>
              <tr>
              <td className="border px-4 py-2">2</td>
              <td className="border px-4 py-2">Product B</td>
              <td className="border px-4 py-2">40</td>
              <td className="border px-4 py-2">700</td>
              </tr> */}

            </tbody>
          </table>

        </div>
      </div>


    </>
  )
}


