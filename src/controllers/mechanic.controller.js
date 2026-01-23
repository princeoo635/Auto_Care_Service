import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { AsyncHandler } from '../utils/AsyncHandler.js'
import { Mechanic } from '../models/mechanic.model.js/'
import { uploadOnCloudinary } from '../utils/cloudinary.js'

// add mechaic details
const addMechanic = AsyncHandler ( async (req,res) => {
    if(req.user.role!=='admin'){
        throw new ApiError(403,"Only admin can add new mechanic.")
    }
    const { name, experience, contact } = req.body
    if ( !name || experience===undefined || !contact){
        throw new ApiError(400,"All fields are required.")
    }
    const existingMechanic = await Mechanic.findOne({ contact });
    if (existingMechanic) {
        throw new ApiError(409, "Mechanic already exists");
    }
    const profileImageLocalPath = req.file?.path
    if ( !profileImageLocalPath ){
        throw new ApiError(400,"profile image is required.")
    }
    const profileImage = await uploadOnCloudinary(profileImageLocalPath)
    if (!profileImage?.url) {
            throw new ApiError(400, "Profile image upload failed");
        }
    const mechanic = await Mechanic.create({
        name,
        experience,
        contact,
        profileImage : profileImage.url
    })
    const createdMechanic = await Mechanic.findById(mechanic._id);

    if( !createdMechanic){
        throw new ApiError(400,"mechanic could not be registered.")
    }
    return res.status(201).json(
        new ApiResponse(201,createdMechanic,"mechanic registered successfully.")
    )
})

export {
    addMechanic
}