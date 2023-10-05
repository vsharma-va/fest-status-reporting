import { MongoClient } from "mongodb";

export const load = async ({ cookies }) => {
    const foundMongoDbURL = cookies.get("mongoDbUri");
    if (foundMongoDbURL) {
        let passOccuranceMap = await getPassOccuranceMap(foundMongoDbURL.toString());
        return { success: true, passOccuranceMap: passOccuranceMap};
    } else {
        return { success: false };
    }
};

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const uri = formData.get("mongoDbUri");
        
        if (uri) {
            // let passOccuranceMap = await getPassOccuranceMap(uri?.toString());
            event.cookies.set('mongoDbUri', uri?.toString())
            return { success: true };
        } else {
            return { success: false };
        }
    },
};

//@ts-ignore
async function getPassOccuranceMap(mongoDbUri) {
    // const formData = await event.request.formData();
    // const uri = formData.get("mongoDbUri");
    if (mongoDbUri) {
        // event.cookies.set("mongoDbUri", uri.toString(), { path: "/" });
        const client = new MongoClient(mongoDbUri.toString());
        const database = client.db("ticketing");
        const passes = database.collection("passes");
        const passesArray = await passes.find({}).toArray();
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
        passesArray.forEach((element) => {
            //@ts-ignore
            passOccuranceMap[element.type][0] += 1;
        });
        return passOccuranceMap;
    }
}
