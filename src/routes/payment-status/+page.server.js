import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";

const projectionTypes = {
    _id: 0,
};
const optionsTypes = {
    projection: projectionTypes,
};

export const load = async (event) => {
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
        let formData = await event.request.formData();
        let emailId = formData.get("emailId");
        //@ts-ignore
        const client = new MongoClient(process.env.MONGO_URL);
        const database = client.db("ticketing");
        const payments = database.collection("payments");

        const foundPayment = await payments
            .find({ email: emailId?.toString() }, optionsTypes)
            .sort({ _id: -1 })
            .toArray();
        return { success: true, foundPayments: foundPayment };
    },
};
