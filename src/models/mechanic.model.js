import mongoose from "mongoose"

const mechanicSchema = new mongoose.Schema({
    
    name : {
        type: String,
        required:true,
        trim:true
    },

    experience : {
        type : Number,
        required : true,
        min : 0
    },

    contact : {
        type : String,
        trim : true,
        required : true,
        unique : true
    },

    isAvailable : {
        type : Boolean,
        default: true
    },

    ratings : [{
        type : Number,
        min : 0,
        max: 5
    }],

    profileImage : {
        type : String,
        required : true
    }

},{timestamps:true})
 
mechanicSchema.virtual("averageRating").get(function () {
    if (!this.ratings.length) return 0 
    const total = this.ratings.reduce((sum,r)=> sum + r ,0) 
    return total / this.ratings.length
}) 
mechanicSchema.set("toJSON", { virtuals: true })
mechanicSchema.set("toObject", { virtuals: true })


export const Mechanic =
mongoose.models.Mechanic || mongoose.model("Mechanic", mechanicSchema)