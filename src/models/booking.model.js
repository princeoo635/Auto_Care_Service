import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
    
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },

    car : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Car",
        required: true
    },

    mechanic : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Mechanic"
    },

    services : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Service"
    }],

    inventoryUsage : [{
        item : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Inventory",
            required: true
        },
        quantity : {
            type : Number,
            required: true,
            min: 1
        },
        priceAtTime : {
            type : Number,
            required: true
        }
    }],

    status : {
        type : String,
        enum : ["pending","confirmed","in_progress","completed","cancelled"],
        default : "pending"
    },

    bookingDate : {
        type : Date,
        default : Date.now
    },

    serviceDate : {
        type : Date,
        required : true
    },

    totalCost : {
        type : Number,
        min : 0,
        default : 0
    }

},{timestamps:true})

export const Booking = mongoose.model("Booking",bookingSchema)