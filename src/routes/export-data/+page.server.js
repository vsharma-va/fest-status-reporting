import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";

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
            if (
                foundAccount.role === "gen+" ||
                foundAccount.role === "gen-" ||
                foundAccount.role === "event_lead"
            ) {
                return { authorised: true };
            } else {
                return { authorised: false };
            }
        }
    }
};
