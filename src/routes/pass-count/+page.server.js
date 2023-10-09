import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";

//@ts-ignore
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
            if (foundAccount.role === "gen+" || foundAccount.role === "gen-") {
                const passOccuranceMap = await getPassOccuranceMap();
                return { authorised: true, passOccuranceMap: passOccuranceMap };
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
        const uri = formData.get("mongoDbUri");

        if (uri) {
            // let passOccuranceMap = await getPassOccuranceMap(uri?.toString());
            event.cookies.set("mongoDbUri", uri?.toString());
            return { success: true };
        } else {
            return { success: false };
        }
    },
};

//@ts-ignore
async function getPassOccuranceMap() {
    // const formData = await event.request.formData();
    // const uri = formData.get("mongoDbUri");
    // event.cookies.set("mongoDbUri", uri.toString(), { path: "/" });
    //@ts-ignore
    const client = new MongoClient(process.env.MONGO_URL);
    const database = client.db("ticketing");
    const passes = database.collection("passes");
    let passOccuranceMap = {
        CLTR_PRO: [0, "Proshow and Cultural Events"],
        SUP_PRO: [-4, "Superpass Proshow + Cultural"],
        CLTR_BOB: [0, "Battle of Bands"],
        CLTR_GRD: [0, "Group Dance"],
        CLTR_FAS: [0, "Fashion Show"],
        ESPORTS: [0, "Esports pass"],
        SPORT_FB_M: [0, "Men's Football"],
        SPORT_BB_M: [0, "Men's Basketball"],
        SPORT_VB_M: [0, "Men's Volleyball"],
        SPORT_TN_M: [0, "Men's Tennis"],
        SPORT_TT_M: [0, "Men's Table Tennis"],
        SPORT_BB_F: [0, "Women's Basketball"],
        SPORT_TB_F: [0, "Women's Throwball"],
        SPORT_TN_F: [0, "Women's Tennis"],
        SPORT_TT_F: [0, "Women's Table Tennis"],
        SPORT_ATH: [0, "Athletics"],
        SPORT_CHS: [0, "Chess"],
    };
    for (let key in passOccuranceMap) {
        const count = await passes.countDocuments({ type: key.toString() });
        //@ts-ignore
        passOccuranceMap[key][0] = count - passOccuranceMap[key][0];
    }
    return passOccuranceMap;
}
