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
    return res.status(201).json(
        new ApiResponse(201,product,"product added successfully.")
    )
})

//update product
const updateProductDetails = AsyncHandler( async (req,res) => {
    if (req.user.role!=="admin"){
        throw new ApiError(403,"only admin can update product.")
    }
    const { productId } = req.params
    if(!productId){
        throw new ApiError(400,"product id is required.")
    }
    const { productName, productNo, type} = req.body
    if( !productName && !productNo && !type ){
        throw new ApiError(400,"atleast one field is required.");
    }
    if (productNo) {
        const exists = await Inventory.findOne({ productNo });
        if (exists && exists._id.toString() !== productId) {
            throw new ApiError(409, "Product number already exists");
        }
    }
    const product = await Inventory.findByIdAndUpdate(
        productId,
        {
            $set:{
                productName,
                productNo,
                type
            }
        },
        { new : true}
    )
    if(!product){
        throw new ApiError(404,"product not found.")
    }
    return res.status(200).json(
        new ApiResponse(200,product,"product updated successfully.")
    )
})

export {
    addProduct,
    updateProductDetails
}