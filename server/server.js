require("dotenv").config()
const admin = require("firebase-admin")
const serviceAccount = require("./serviceAccountKey.json")
const express = require("express")
const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");
const moment = require("moment");
const port = 5000;

app.use(express.json())
app.use(bodyParser.json())
app.use(
    cors({
        origin: ['http://localhost:3000','https://checkout.stripe.com','https://stripe.com/cookie-settings/enforcement-mode'],
    })
)

const [mobileMonthly,mobileYearly] = ['price_1NdD6xSGjf6Wd71Uob5Mhz1I','price_1NdD6xSGjf6Wd71UDuoh8rss'];
const [basicMonthly,basicYearly] = ['price_1NdCcCSGjf6Wd71UhUKltCLJ','price_1NdD40SGjf6Wd71UOhfBeCC7'];
const [standardMonthly,standardYearly] = ['price_1NdCcVSGjf6Wd71UIsgXcBPu','price_1NdD33SGjf6Wd71UzdIhVNvB'];
const [premiumMonthly,premiumYearly] = ['price_1NdCcvSGjf6Wd71U6Jfy9Nhj','price_1NdD2bSGjf6Wd71UES9t20wB'];

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://stripe-subscribtion-app-default-rtdb.firebaseio.com"
});

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

/* create subscription api */

const stripeSession = async(plan) => {
    try{
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: plan,
                    quantity: 1
                },
            ],
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel"
        });
        return session;
    }catch(error){
        return error;
    }
}

app.post("/api/v1/create-subscription-checkout-session", async(req,res) => {
    const {plan,customerId} = req.body;
    let planId = null;
    if(plan == 700) {planId = premiumMonthly;}
    else if(plan == 7000) {planId = premiumYearly;}
    else if(plan == 500) {planId = standardMonthly;}
    else if(plan == 5000) {planId = standardYearly;}
    else if(plan == 200) {planId = basicMonthly;}
    else if(plan == 2000) {planId = basicYearly;}
    else if(plan == 100) {planId = mobileMonthly;}
    else if(plan == 1000) {planId = mobileYearly;}

    try{
        const session = await stripeSession(planId);
        const user = await admin.auth().getUser(customerId);

        await admin.database().ref("users/").child(user.uid).update({
            subscription: {
                sessionId: session.id,
            }
        });
        // console.log(session);
        return res.json({session});
    }catch(error){
        res.send(error);
    }
})

/* payment success  api */
app.post("/api/v1/payment-success", async(req, res) => {
    const {sessionId, firebaseId} = req.body;
    console.log("sessions id : ",sessionId);
    console.log("firebase id : ",firebaseId);
    try{
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if(session.payment_status === 'paid'){
            const subscriptionId = session.subscription;
            try{
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const user = await admin.auth().getUser(firebaseId);
                const planId = subscription.plan.id;
                let planName = "";
                let planType = "";
                const startDate = moment.unix(subscription.current_period_start).format('YYYY-MM-DD');
                const endDate = moment.unix(subscription.current_period_end).format('YYYY-MM-DD');
                const durationInSeconds = subscription.current_period_end - subscription.current_period_start;
                const durationInDays = moment.duration(durationInSeconds, 'seconds').asDays();

                if(subscription.plan.amount === 100000) {planName = "Mobile"; planType = "Yearly";}
                else if(subscription.plan.amount === 10000) {planName = "Mobile"; planType = "Monthly";}
                else if(subscription.plan.amount === 200000) {planName = "Basic"; planType = "Yearly";}
                else if(subscription.plan.amount === 20000) {planName = "Basic"; planType = "Monthly";}
                else if(subscription.plan.amount === 500000) {planName = "Standard"; planType = "Yearly";}
                else if(subscription.plan.amount === 50000) {planName = "Standard"; planType = "Monthly";}
                else if(subscription.plan.amount === 700000) {planName = "Premium"; planType = "Yearly";}
                else if(subscription.plan.amount === 70000) {planName = "Premium"; planType = "Monthly";}

                await admin.database().ref("users/").child(user.uid).update({
                    subscription: {
                        sessionId: sessionId,
                        planId: planId,
                        planType: planType,
                        planName: planName,
                        planStartDate: startDate,
                        planEndDate: endDate,
                        planDuration: durationInDays
                    }
                });

            }catch(error){
                console.error("Error Retrieving Subscription: ",error);
            }
            return res.json({message: "Payment Successful."});
        }else{
            return res.json({message: "Payment Failed."});
        }
    }catch(error){
        res.send(error);
    }
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
})
