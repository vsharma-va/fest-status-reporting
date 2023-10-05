import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";

export const load = async (event) => {
    let mongoDbUri = event.cookies.get("mongoDbUri");
    if (!mongoDbUri) {
        throw redirect(302, "/");
    }
};

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const emailId = formData.get("emailId");
        const passType = formData.get("passType");
        const mongoDbUri = event.cookies.get("mongoDbUri");
        if (emailId && passType && mongoDbUri) {
            const client = new MongoClient(mongoDbUri.toString());
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
