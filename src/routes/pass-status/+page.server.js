import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";

const projectionTypes = {
    _id: 0,
};
const optionsTypes = {
    projection: projectionTypes,
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
        if (emailId) {
            let uri = event.cookies.get("mongoDbUri");
            if (uri) {
                const client = new MongoClient(uri);
                const database = client.db("ticketing");
                const passes = database.collection("passes");
                const foundPass = await passes.find(
                    { email: emailId?.toString(), generated: true },
                    optionsTypes
                ).toArray();
                if (foundPass) {
                    return { success: true, foundPass: foundPass };
                } else {
                    return { success: false, foundPass: 'failure'};
                }
            }
        }
    },
};
