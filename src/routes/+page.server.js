import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";

export const load = async (event) => {
    const session = await event.locals.getSession();
    if (!session?.user) {
        return { loggedIn: false }
    } else {
        return { loggedIn: true }
    }
};
