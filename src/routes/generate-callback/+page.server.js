import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";

export const load = async (event) => {
    // let mongoDbUri = event.cookies.get("mongoDbUri");
    // if (!mongoDbUri) {
    //     throw redirect(302, "/");
    // }
    const session = await event.locals.getSession();
    if (!session?.user) {
        throw redirect(302, "/");
    } else {
        //@ts-ignore
        const client = new MongoClient(process.env.MONGO_URL);
        const saDatabase = client.db("status_app");
        const accounts = saDatabase.collection("sa_accounts");

        const foundAccount = await accounts.findOne({
            email: session.user.email,
        });
        if (!foundAccount) {
            return { authorised: false };
        } else {
            if (foundAccount.role === "gen+") {
                return { authorised: true };
            } else {
                return { authorised: false };
            }
        }
    }
};

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const emailId = formData.get("emailId");
        const passType = formData.get("passType");
        if (emailId && passType) {
            //@ts-ignore
            const client = new MongoClient(process.env.MONGO_URL_WRITE);
            const database = client.db("ticketing");
            const payments = database.collection("payments");
            const foundPayment = await payments.findOneAndUpdate(
                {
                    email: emailId,
                    type: passType,
                    status: "paid",
                },
                { $set: { status: "created" } }
            );
            if (foundPayment) {
                const constructedUrl = `https://falak.mitblrfest.in/callback/pay/${foundPayment.ref_id}`;
                return { success: true, url: constructedUrl };
            }
            return { success: false, url: null };
        }
        return { success: false, url: null };
    },
};
