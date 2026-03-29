import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { AsyncHandler } from "../utils/AsyncHandler.js"

import { Mechanic } from "../models/mechanic.model.js"
import { Service } from "../models/service.model.js"
import { Booking } from "../models/booking.model.js"
import { Inventory } from "../models/inventory.model.js"
import { Car } from "../models/car.model.js"


//   CREATE BOOKING
const createBooking = AsyncHandler(async (req, res) => {

    const { carId, services, serviceDate } = req.body

    if (!carId || !services || !services.length || !serviceDate) {
        throw new ApiError(400, "car, services and serviceDate are required")
    }

    const car = await Car.findById(carId)

    if (!car) {
        throw new ApiError(404, "car not found")
    }

    if (car.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you can only book service for your own car")
    }

    const selectedDate = new Date(serviceDate)

    if (selectedDate < new Date()) {
        throw new ApiError(400, "service date cannot be in the past")
    }

    const serviceDocs = await Service.find({ _id: { $in: services } })

    if (serviceDocs.length !== services.length) {
        throw new ApiError(404, "some services not found")
    }

    const totalCost = serviceDocs.reduce((sum, s) => sum + s.serviceCharge, 0)

    const booking = await Booking.create({
        user: req.user._id,
        car: carId,
        services: services,
        serviceDate,
        totalCost
    })

    return res
        .status(201)
        .json(new ApiResponse(201, booking, "booking created successfully"))
})


//   ASSIGN MECHANIC
const assignMechanic = AsyncHandler(async (req, res) => {

    if (req.user.role !== "admin") {
        throw new ApiError(403, "only admin can assign mechanic")
    }

    const { bookingId } = req.params
    const { mechanicId } = req.body

    const mechanic = await Mechanic.findById(mechanicId)

    if (!mechanic) {
        throw new ApiError(404, "mechanic not found")
    }

    const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
            $set: {
                mechanic: mechanicId,
                status: "confirmed"
            }
        },
        { new: true }
    )

    if (!booking) {
        throw new ApiError(404, "booking not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, booking, "mechanic assigned"))
})


//   ADD PARTS USED
const addPartsUsed = AsyncHandler(async (req, res) => {

    const { bookingId } = req.params
    const { itemId, quantity } = req.body

    if (!itemId || !quantity) {
        throw new ApiError(400, "itemId and quantity required")
    }

    const booking = await Booking.findById(bookingId)

    if (!booking) {
        throw new ApiError(404, "booking not found")
    }

    if (booking.status === "completed") {
        throw new ApiError(400, "cannot add parts to completed service")
    }

    const item = await Inventory.findById(itemId)

    if (!item) {
        throw new ApiError(404, "inventory item not found")
    }

    if (item.quantity < quantity) {
        throw new ApiError(400, "insufficient inventory")
    }

    item.quantity -= quantity
    await item.save()

    const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
            $push: {
                inventoryUsage: {
                    item: itemId,
                    quantity,
                    priceAtTime: item.price
                }
            },
            $inc: {
                totalCost: item.price * quantity
            }
        },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedBooking, "part added to service"))
})


//   COMPLETE SERVICE
const completeService = AsyncHandler(async (req, res) => {

    const { bookingId } = req.params

    const booking = await Booking.findById(bookingId)

    if (!booking) {
        throw new ApiError(404, "booking not found")
    }

    if (!booking.mechanic) {
        throw new ApiError(400, "assign mechanic before completing service")
    }

    booking.status = "completed"

    await booking.save()

    const populatedBooking = await Booking.findById(bookingId)
        .populate("services")
        .populate("inventoryUsage.item")
        .populate("mechanic")

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                booking: populatedBooking,
                finalBill: populatedBooking.totalCost
            },
            "service completed successfully"
        )
    )
})


export {
    createBooking,
    assignMechanic,
    addPartsUsed,
    completeService
}