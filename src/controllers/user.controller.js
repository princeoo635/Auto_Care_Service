import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { AsyncHandler } from '../utils/AsyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { User } from '../models/user.model.js'

//register user
const registerUser = AsyncHandler( async (req,res) => {
    const { name,email,password,userName,phone,address } = req.body
    if ( !email || !password || !userName || !phone || !name ) {
        throw new ApiError(400, "All required fields must be provided");
    }
    const existingUser = await User.findOne({
        $or: [{ email }, { userName }]
    });
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }
    const profileImageLocalPath = req.file?.path;;
    
    if(!profileImageLocalPath){
        throw new ApiError(400,"Image file is required")
        }     
    const profileImage =await uploadOnCloudinary(profileImageLocalPath)
    if (!profileImage?.url) {
        throw new ApiError(400, "Profile image upload failed");
    }

    const user=await User.create({
        name,
        profileImage:profileImage.url,
        email,
        password,
        userName,
        phone,
        address
    })
     const createdUser=await User.findById(user._id)
        .select("-password")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the User!")
    }
    return res.status(201).json(
        new ApiResponse(201,createdUser,"User registered successfully")
    )
})
export {
    registerUser
}