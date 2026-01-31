import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { AsyncHandler } from '../utils/AsyncHandler.js'
import { Car } from '../models/car.model.js/'

const registerCar = AsyncHandler(async (req,res) => {
    const { brand, model, licenseNo } =req.body
    if( !brand || !model || !licenseNo ){
        throw new ApiError(400,"All fields are required.")
    }
    const existingCar = await Car.findOne({licenseNo})
    if(existingCar){
        throw new ApiError(400,"This car is already register with us.")
    }
    const car =await Car.create({
        brand,
        model,
        licenseNo,
        owner : req.user._id
    })
    return res.status(201).json(
        new ApiResponse(201, car, "Car registered successfully")
    )
})

export{
    registerCar
}