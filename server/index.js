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

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);


// stripe price id
const [mobileMonthly, mobileYearly] = ['price_1NdD6xSGjf6Wd71Uob5Mhz1I', 'price_1NdD6xSGjf6Wd71UDuoh8rss'];
const [basicMonthly, basicYearly] = ['price_1NdCcCSGjf6Wd71UhUKltCLJ', 'price_1NdD40SGjf6Wd71UOhfBeCC7'];
const [standardMonthly, standardYearly] = ['price_1NdCcVSGjf6Wd71UIsgXcBPu', 'price_1NdD33SGjf6Wd71UzdIhVNvB'];
const [premiumMonthly, premiumYearly] = ['price_1NdCcvSGjf6Wd71U6Jfy9Nhj', 'price_1NdD2bSGjf6Wd71UES9t20wB'];


/* create subscription api */
const stripeSession = async (plan) => {
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
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel"
        });
        return session;
    } catch (error) {
        return error;
    }
}

//importing routes
const { userRoute } = require("./routes/users.route");
// const { subscriptionRoute } = require("./routes/subscriptions.route");

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
// app.use("/subscription", subscriptionRoute);


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
        const session = await stripeSession(planId);
        const user = await userModel.findOne({ _id: userId });

        if (user) {
            await updateUserSubscription(user._id, session.id, planId);
            return res.status(201).json({ status: 201, sessionId: session.id, planId: planId, userId: user._id, session });
            // res.json({ session });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const updateUserSubscription = async (userId, sessionId, planId) => {
    try {
        // Fetch the user based on the userId
        const user = await userModel.findById(userId);

        if (user) {
            // Create a new subscription entry
            const newSubscription = {
                planId: planId,
                sessionId: sessionId,
                enrolledAt: new Date()
            };

            // Update the subscriptionEnrolled array in the user document
            user.subscriptionEnrolled.push(newSubscription);
            console.log(userModel.findOne({sessionId: sessionId}));
            // Save the updated user document
            await user.save();
        }
    } catch (error) {
        console.error('Error updating user subscription:', error);
        throw error; // Rethrow the error for proper error handling
    }
};


/* payment success  api */
app.post("/api/v1/payment-success", async (req, res) => {
    const { sessionId, userId } = req.body;

    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const subscriptionId = session.subscription;

            try {
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const user = await getUserFromMongoDB(userId);

                if (user) {
                    const planId = subscription.plan.id;
                    const startDate = moment.unix(subscription.current_period_start).format('YYYY-MM-DD');
                    const endDate = moment.unix(subscription.current_period_end).format('YYYY-MM-DD');
                    const durationInSeconds = subscription.current_period_end - subscription.current_period_start;
                    const durationInDays = moment.duration(durationInSeconds, 'seconds').asDays();

                    await updateUserSubscriptionDetails(user._id, sessionId, planId, startDate, endDate, durationInDays);
                } else {
                    console.error("User not found in MongoDB");
                }

            } catch (error) {
                console.error("Error Retrieving Subscription: ", error);
            }
            return res.json({ message: "Payment Successful." });
        } else {
            return res.json({ message: "Payment Failed." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


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
