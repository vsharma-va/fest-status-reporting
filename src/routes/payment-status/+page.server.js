import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";

const projectionTypes = {
	_id: 0
};
const optionsTypes = {
	projection: projectionTypes
};

export const load = async (event) => {
    let mongoDbUri = event.cookies.get("mongoDbUri");
    if (!mongoDbUri) {
        throw redirect(302, "/");
    }
};

export const actions = {
    default: async (event) => {
        let formData = await event.request.formData();
        let emailId = formData.get("emailId");
        let mongoDbUri = event.cookies.get("mongoDbUri");
        if (mongoDbUri) {
            const client = new MongoClient(mongoDbUri.toString());
            const database = client.db("ticketing");
            const payments = database.collection("payments");
            const foundPayment = await payments
                .find({ email: emailId?.toString() }, optionsTypes)
                .sort({ _id: -1 })
                .toArray();
            return { success: true, foundPayments: foundPayment };
        } else {
            return { success: false };
        }
    },
};
