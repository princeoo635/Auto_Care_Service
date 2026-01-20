import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { AsyncHandler } from '../utils/AsyncHandler.js'
import { Inventory } from '../models/inventory.model.js/'

//add new product
const addProduct = AsyncHandler (async (req,res) => {
    if (req.user.role!=="admin"){
        throw new ApiError(403,"only admin can add product.")
    }
    const { productName, productNo, type, price, quantity } = req.body
    if( !productName || !productNo || !type || price==null || quantity==null){
        throw new ApiError(400,"all fields are required.");
    }
    const existingProduct = await Inventory.findOne({productNo})
    if(existingProduct){
        throw new ApiError(409,"Product is already added in database.")
    }
    const product= await Inventory.create({
        productName,
        productNo,
        type,
        price,
        quantity
    })
    if(!product){
        throw new ApiError(404,"Product could not be added.")
    }
    res.status(201).json(
        new ApiResponse(201,product,"product added successfully.")
    )
})



export {
    addProduct,
}