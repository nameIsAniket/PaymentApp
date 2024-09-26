import express from "express";
import prisma from "@repo/db/client"
const app = express();

app.post("/hdfcWebhook",async(req,res) => {
    //TODO : zod validation + need to add the webhook secrete here
     const paymentInformation = {
        token : req.body.token,
        userID : req.body.user_identifier,
        amount : req.body.amount
    };

    await prisma.balance.update({
        where : {
            userId : paymentInformation.userID
        },
        data : {
            amount : {
                increment : paymentInformation.amount
            }
        }
    })

    await prisma.onRampTransaction.update({
        where : {
            token : paymentInformation.token
        },
        data : {
            status : "Success"
        }
    })

    res.status(200).json({
        message : "captured"
    })
    //todo: update the balance in db and add transaction

})

app.listen(3000)