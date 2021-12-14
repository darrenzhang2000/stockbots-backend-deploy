const { response } = require("express")
const express = require("express")
const router = express.Router()
const Portfolio = require("../models/Portfolio")
const User = require("../models/User")

// Get all user portfolios 
router.get("/all", (req, res) => {
    Portfolio.find({}, async (err, portfolios) => {
        if (err) {
            res.send({
                success: false,
                message: "User has no portfolio"
            })
        } else {
            res.send({
                success: true,
                portfolios: portfolios
            })
        }
    })
})



// The get request finds the portfolio that corresponds to the specified email. If the user does not have a portfolio,
// then an error message is displayed. Otherwise, the portfolio response is sent.
router.get("/", (req, res) => {
    var { email } = req.query

    Portfolio.find({ email: email }, async (err, portfolios) => {
        if (portfolios.length == 0) {
            res.send({
                success: false,
                message: "User has no portfolio"
            })
        } else {
            res.send({
                success: true,
                portfolios: portfolios
            })
        }
    })
})

// The post request allows us to create a new user portfolio. 
router.post("/", (req, res) => {
    var { email, total, spendingPower, savingsTotal } = req.body

    const portfolio = new Portfolio({
        email, total, spendingPower, savingsTotal
        })

    User.find({ email: email }, (err, emails) => {
        if (!emails.length) {
            res.send({
                sucess: false,
                message: "User does not exist"
            })
        } else {
            portfolio.save((err) => {
                if (err) {
                    res.send({
                        sucess: false,
                        message: err
                    })
                    console.log(err)
                } else {
                    res.send({
                        sucess: true,
                        message: "Portfolio successfully added"
                    })
                }
            })
        }
    })
})

// deposit to or withdraw from savings account
router.put("/withdrawSavings", (req, res) => {
    var { email, amount } = req.body

    Portfolio.findOneAndUpdate({ email: email },
        { //  the $inc operator that takes in the spendingPower and increases the existing spendingPower by the current amount, which could be either positive or negative.
            $inc: {
                spendingPower: amount,
                savingsTotal: -amount
            }
        },
        (err, response) => {
            if (err) {
                res.send({
                    success: false,
                    message: err
                })
            } else {
                res.send({
                    success: true,
                    spendingPower: response.spendingPower,
                    savingsTotal: response.savingsTotal
                })
            }
        }
    )
})


// The post request allows us to update a new user portfolio. 
router.put("/", (req, res) => {
    var { email, amount } = req.body
    Portfolio.findOneAndUpdate({email: email}, 
        {$inc:{spendingPower: amount}}, (error, response) => {
            if(error){
                res.send(
                    {
                        success: false, 
                        message: error
                    }
                )
            }
            else{
                res.send(
                    {
                        success: true,
                        message: "Succesfully updated DataBase",
                        spendingPower: response.spendingPower
                    }
                )
            }
        })
})

module.exports = router