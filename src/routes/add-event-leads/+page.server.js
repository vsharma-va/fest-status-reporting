import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";

//@ts-ignore
const client = new MongoClient(process.env.MONGO_URL_WRITE);

//@ts-ignore
export const load = async (event) => {
    const session = await event.locals.getSession();
    if (!session?.user) {
        throw redirect(302, "/");
    } else {
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
    //@ts-ignore
    default: async (event) => {
        const formData = await event.request.formData();
        const emailId = formData.get("emailId");
        if (emailId) {
            const saDatabase = client.db("status_app");
            const accounts = saDatabase.collection("sa_accounts");
            const foundAccount = await accounts.findOne({ email: emailId });
            if (foundAccount) {
                return { success: false, reason: "User already exists" };
            } else {
                await accounts.insertOne({
                    email: emailId,
                    role: "event_lead",
                });
                return { success: true, reason: "Created account" };
            }
        } else {
            return { success: false, reason: "Invalid Email ID" };
        }
    },
};
