import { redirect } from "@sveltejs/kit";
import { MongoClient } from "mongodb";
import { fetchRegisteredUsers } from "$lib/common/RegistrationFetching.js";
import { fetchUnregisteredUsers } from "$lib/common/RegistrationFetching.js";

const projectionTypes = {
    _id: 0,
};
const optionsTypes = {
    projection: projectionTypes,
};

//@ts-ignore
const client = new MongoClient(process.env.MONGO_URL);

const events = [
    {
        name: "Saarang",
        type: "solo",
        strapiId: "C_SAARANG",
    },
    {
        name: "Battle Of Bands",
        type: "team",
        strapiId: "C_BOB",
    },
    {
        name: "MindScribe",
        type: "solo",
        strapiId: "C_MNDSCR",
    },
    {
        name: "Beats and Carrots",
        type: "solo",
        strapiId: "C_BTSCAR",
    },
    {
        name: "Echoes",
        type: "solo",
        strapiId: "C_ECHOES",
    },
    {
        name: "Natyam Nirvana",
        type: "team",
        strapiId: "C_GRC",
    },
    {
        name: "Street Beat",
        type: "solo",
        strapiId: "C_STRBET",
    },
    {
        name: "Bat Bowl Bid",
        type: "team",
        strapiId: "C_BTBLBD",
    },
    {
        name: "Logolympic",
        type: "solo",
        strapiId: "C_LOGLYM",
    },
    {
        name: "Beat2Beat",
        type: "team",
        strapiId: "C_GRW",
    },
    {
        name: "Focus & Frame",
        type: "solo",
        strapiId: "C_FCSFRM",
    },
    {
        name: "Zenith",
        type: "solo",
        strapiId: "C_ZENITH",
    },
    {
        name: "Shark Tank",
        type: "team",
        strapiId: "C_SHKTNK",
    },
    {
        name: "Runway Rendezvous",
        type: "team",
        strapiId: "C_FAS",
    },
    {
        name: "Surge Safari",
        type: "team",
        strapiId: "C_SRGSAF",
    },
    {
        name: "Brushstroke Battle",
        type: "solo",
        strapiId: "C_BSHBTL",
    },
    {
        name: "Manga Odyssey",
        type: "solo",
        strapiId: "C_MNGODY",
    },
    {
        name: "Rangavalli",
        type: "team",
        strapiId: "C_RANCOM",
    },
    {
        name: "Theatrical Showdown",
        type: "team",
        strapiId: "C_THESHD",
    },
    {
        name: "Street Spotlight",
        type: "team",
        strapiId: "C_STRBET",
    },
    {
        name: "Market Mayhem",
        type: "team",
        strapiId: "C_MKTMHM",
    },
    {
        name: "CineCraft",
        type: "team",
        strapiId: "C_CINCRF",
    },
    {
        name: "BrainWave",
        type: "team",
        strapiId: "C_BRNWAV",
    },
    {
        name: "Quiz-a-palooza",
        type: "team",
        strapiId: "C_QZAPLZ",
    },
    {
        name: "Battle Of Babble",
        type: "team",
        strapiId: "C_BTLBAB",
    },
    {
        name: "Athletics",
        type: "solo",
        strapiId: "S_ATH",
    },
    {
        name: "Women's Basketball",
        type: "team",
        starpiId: "S_BB_F",
    },
    {
        name: "Men's Basketball",
        type: "team",
        strapiId: "S_BB_M",
    },
    {
        name: "Chess",
        type: "team",
        strapiId: "S_CHS",
    },
    {
        name: "Men's Football",
        type: "team",
        strapiId: "S_FB_M",
    },
    {
        name: "Women's Tennis",
        type: "solo",
        strapiId: "S_TN_F",
    },
    {
        name: "Men's Tennis",
        type: "team",
        strapiId: "S_TN_M",
    },
    {
        name: "Women's Table Tennis",
        type: "solo",
        strapiId: "S_TT_F",
    },
    {
        name: "Men's Table Tennis",
        type: "team",
        strapiId: "S_TT_M",
    },
    {
        name: "Men's Volleyball",
        type: "team",
        strapiId: "S_VB_M",
    },
];

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
            if (
                foundAccount.role === "gen+" ||
                foundAccount.role === "gen-" ||
                foundAccount.role === "event_lead"
            ) {
                return { authorised: true, events: events };
            } else {
                return { authorised: false };
            }
        }
    }
};

export const actions = {
    // @ts-ignore
    default: async (event) => {
        const session = await event.locals.getSession();
        if (!session?.user) {
            throw redirect(302, "/");
        } else {
            let perPage;
            const formData = await event.request.formData();
            let eventId = formData.get("eventName");
            let pageNumber = formData.get("pageNumber");
            let dataSetting = formData.get("dataSetting");
            if (dataSetting && eventId) {
                // console.log("hello");
                let requiredEventObj;
                events.forEach((indiObj) => {
                    if (indiObj.strapiId == eventId) {
                        requiredEventObj = indiObj;
                    }
                });
                if (requiredEventObj.type === "team") {
                    perPage = 2;
                } else {
                    perPage = 5;
                }
                //@ts-ignore
                const teamDatabase = client.db("teams");
                if (requiredEventObj) {
                    console.log(requiredEventObj);
                    if (dataSetting === "reg") {
                        return await fetchRegisteredUsers(
                            requiredEventObj,
                            teamDatabase,
                            pageNumber,
                            perPage
                        );
                    } else if (dataSetting === "unreg") {
                        return await fetchUnregisteredUsers(requiredEventObj);
                    }
                }
            } else {
                throw redirect(302, "/");
            }
        }
    },
};
