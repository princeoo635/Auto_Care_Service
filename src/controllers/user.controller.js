import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { AsyncHandler } from '../utils/AsyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { User } from '../models/user.model.js'

//option
const option={
    httpOnly: true,
    secure: true
}

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
//Login Users
const loginUser = AsyncHandler( async (req,res) => {
    const { email,password } = req.body
    if(!email){
        throw new ApiError(400,"Email is required.")
    }
    const user = await User.findOne({ email })
    if( !user ){
        throw new ApiError(404," User does not exists.")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if( !isPasswordValid ){
        throw new ApiError(400,"Password is invalid.")
    }
    const accessToken = await user.generateAccessToken()
    const loggedInUser = await User.findById(user._id).select('-password')
    res.status(200)
    .cookie('accesstoken',accessToken,option)
    .json(
        new ApiResponse(200,loggedInUser,"user successfully logged in.")
    )
})
//logout
const logoutUser=AsyncHandler(
    async (req,res)=>{
        return res
        .status(200)
        .clearCookie("accesstoken",option)
        .json(new ApiResponse(200,{},"User logged out !!"))

    }
)

export {
    registerUser,
    loginUser,
    logoutUser
}