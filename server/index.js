const express = require('express');
const { connexion } = require('./db/connection');
const app = express();
require("dotenv").config()
const cors = require('cors');
const crypto = require('crypto');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const moment = require("moment");

const userModel = require("./models/Users.model");

//importing routes
const { userRoute } = require("./routes/users.route");

app.use(cors({
    credentials: true,
    origin: [`${process.env.REACT_APP_CLIENT_URL}`, `${process.env.REACT_APP_SERVER_URL}`]
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// calling API
app.use("/user", userRoute);


const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const webhookSecret = process.env.WEBHOOK_SECRET;


// stripe price id
const [mobileMonthly, mobileYearly] = ['price_1NdD6xSGjf6Wd71Uob5Mhz1I', 'price_1NdD6xSGjf6Wd71UDuoh8rss'];
const [basicMonthly, basicYearly] = ['price_1NdCcCSGjf6Wd71UhUKltCLJ', 'price_1NdD40SGjf6Wd71UOhfBeCC7'];
const [standardMonthly, standardYearly] = ['price_1NdCcVSGjf6Wd71UIsgXcBPu', 'price_1NdD33SGjf6Wd71UzdIhVNvB'];
const [premiumMonthly, premiumYearly] = ['price_1NdCcvSGjf6Wd71U6Jfy9Nhj', 'price_1NdD2bSGjf6Wd71UES9t20wB'];


/* create subscription api */
const createStripeSession = async (plan) => {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: plan,
                    quantity: 1
                },
            ],
            success_url: `${process.env.REACT_APP_CLIENT_URL}/success`,
            cancel_url: `${process.env.REACT_APP_CLIENT_URL}/cancel`
        });
        // res.json({ id: session.id })
        return session;
    } catch (error) {
        return error;
    }
}

/* retrieve subscription data*/
// const retrieveStripeSession = async (plan) => {
//     try {
//         const subscription = await stripe.subscriptions.retrieve(
//             'sub_1NgZvJ2eZvKYlo2CQMdLeLAZ'
//         );
//         // res.json({ id: session.id })
//         return subscription;
//     } catch (error) {
//         return error;
//     }
// }

const retrievedDataStore = {};

// app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
//     const sig = req.headers['stripe-signature'];

//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
//     } catch (err) {
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle the event
//     // switch (event.type) {
//     //     case 'checkout.session.async_payment_failed':
//     //         const checkoutSessionAsyncPaymentFailed = event.data.object;
//     //         // Then define and call a function to handle the event checkout.session.async_payment_failed
//     //         break;
//     //     case 'checkout.session.async_payment_succeeded':
//     //         const checkoutSessionAsyncPaymentSucceeded = event.data.object;
//     //         // Then define and call a function to handle the event checkout.session.async_payment_succeeded
//     //         break;
//     //     case 'checkout.session.completed':
//     //         const checkoutSessionCompleted = event.data.object;
//     //         // Then define and call a function to handle the event checkout.session.completed
//     //         break;
//     //     case 'subscription_schedule.aborted':
//     //         const subscriptionScheduleAborted = event.data.object;
//     //         // Then define and call a function to handle the event subscription_schedule.aborted
//     //         break;
//     //     case 'subscription_schedule.canceled':
//     //         const subscriptionScheduleCanceled = event.data.object;
//     //         // Then define and call a function to handle the event subscription_schedule.canceled
//     //         break;
//     //     case 'subscription_schedule.completed':
//     //         const subscriptionScheduleCompleted = event.data.object;
//     //         // Then define and call a function to handle the event subscription_schedule.completed
//     //         break;
//     //     case 'subscription_schedule.created':
//     //         const subscriptionScheduleCreated = event.data.object;
//     //         // Then define and call a function to handle the event subscription_schedule.created
//     //         break;
//     //     // ... handle other event types
//     //     default:
//     //         console.log(`Unhandled event type ${event.type}`);
//     // }

//     if (event.type === 'checkout.session.completed') {
//         const session = event.data.object;
//         const subscription = await stripe.subscriptions.retrieve(session.subscription);

//         const checkoutSummary = {
//             sessionId: session.id,
//             paymentStatus: session.payment_status,
//             // Other relevant session properties
//         };

//         const subscriptionDetails = {
//             subscriptionId: subscription.id,
//             planId: subscription.items.data[0].price.id,
//             // Other relevant subscription properties
//         };

//         // Store the data in your database or perform any necessary actions
//         // ...
//         retrievedDataStore[session.id] = {
//             checkoutSummary,
//             subscriptionDetails,
//         };


//         // Send a response back to Stripe
//         res.status(200).json({ received: true });
//         res.send();
//     }else{
//         console.log("Webhook error");
//         res.status(200).json("Webhook error");
//     }
// });

// Add a new route to fetch retrieved data
app.get('/retrieved-data/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    // Retrieve data from the temporary store based on sessionId
    const retrievedData = retrievedDataStore[sessionId];
    if (!retrievedData) {
        return res.status(404).json({ message: 'Data not found' });
    }
    res.json(retrievedData);
});


/* checkout success  api */
app.post("/api/v1/create-subscription-checkout-session", async (req, res) => {
    const { plan, userId } = req.body;
    let planId = null;

    if (plan == 700) planId = premiumMonthly;
    else if (plan == 7000) planId = premiumYearly;
    else if (plan == 500) planId = standardMonthly;
    else if (plan == 5000) planId = standardYearly;
    else if (plan == 200) planId = basicMonthly;
    else if (plan == 2000) planId = basicYearly;
    else if (plan == 100) planId = mobileMonthly;
    else if (plan == 1000) planId = mobileYearly;

    try {
        const session = await createStripeSession(planId);
        const user = await userModel.findOne({ _id: userId });
        const current_period_start = new Date();
        const current_period_end = new Date();

        if (planId == premiumMonthly || planId == standardMonthly || planId == basicMonthly || planId == mobileMonthly) {
            current_period_end.setDate(current_period_end.getDate() + 30);
        }
        if (planId == premiumYearly || planId == standardYearly || planId == basicYearly || planId == mobileYearly) {
            current_period_end.setDate(current_period_end.getDate() + 365);
        }
        const durationInSeconds = current_period_end - current_period_start;
        const durationInDays = (moment.duration(durationInSeconds, 'seconds').asDays()) / 1000;

        if (user) {
            await updateUserSubscription(user._id, session.id, planId, current_period_start, current_period_end, durationInDays);
            // return res.status(201).json({ status: 201, sessionId: session.id, planId: planId, userId: user._id, session });
            res.json({ session });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const updateUserSubscription = async (userId, sessionId, planId, current_period_start, current_period_end, durationInDays) => {
    try {
        // Fetch the user based on the userId
        const user = await userModel.findById(userId);

        if (user) {
            // Create a new subscription entry
            const newSubscription = {
                planId: planId,
                sessionId: sessionId,
                enrolledAt: new Date(),
                startDate: current_period_start,
                endDate: current_period_end,
                durationInDays: durationInDays,
            };

            // Update the subscriptionEnrolled array in the user document
            user.subscriptionEnrolled.push(newSubscription);
            await updateUserSubscriptionDetails(userId, newSubscription.sessionId, newSubscription.planId, newSubscription.startDate, newSubscription.endDate, newSubscription.durationInDays);
            // Save the updated user document
            await user.save();
        }
    } catch (error) {
        console.error('Error updating user subscription:', error);
        throw error; // Rethrow the error for proper error handling
    }
};


async function updateUserSubscriptionDetails(userId, sessionId, planId, startDate, endDate, durationInDays) {
    await userModel.updateOne(
        { _id: userId },
        {
            $set: {
                "subscription.sessionId": sessionId,
                "subscription.planId": planId,
                "subscription.planStartDate": startDate,
                "subscription.planEndDate": endDate,
                "subscription.planDuration": durationInDays
            }
        }
    );
}


app.listen(3030, () => {
    console.log('Server start at port no : 3030...');
})
