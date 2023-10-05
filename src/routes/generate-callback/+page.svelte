<script>
    import { enhance } from "$app/forms";

    let emailId = "";
    let passType = "";

    export let form;

    //@ts-ignore
    function submit({ formData }) {
        if (emailId && passType) {
            formData.set("emailId", emailId);
            formData.set("passType", passType);
        }
    }
</script>

<form
    method="post"
    use:enhance={(event) => {
        submit(event);
        return async ({ update }) => {
            update({ reset: false });
        };
    }}
>
    <div class="flex items-center justify-center mt-5">
        <div
            class=" bg-[#1C1337] relative p-2 border-[1px] border-white max-md:font-semibold text-center max-md:text-md z-[9] max-w-[30%] max-sm:max-w-[70%] max-xs:max-w-[90%] max-md:max-w-[50%] max-md:text-sm max-xl:max-w-[40%] max-md:my-[20%] overflow-hidden"
        >
            <div
                class="font-yatra text-center uppercase font-bold text-[#EFF7CF] text-xl p-2"
            >
                Enter The Users Email ID
            </div>

            <!--inputs-->
            <div class=" text-white font-extralight">
                <div class="mt-[20px] px-4 sm:px-6">
                    <input
                        placeholder="Email Id"
                        class=" font-yatra p-2 max-sm:text-lg placeholder:max-md:text-lg w-full bg-transparent outline-none duration-200 caret-[#EFF7CF] placeholder:text-[#EFF7CF] text-[#EFF7CF] border-b-2"
                        type="text"
                        bind:value={emailId}
                    />
                    <!-- <input
                        placeholder="Pass Type"
                        class="font-yatra p-2 max-sm:text-lg placeholder:max-md:text-lg w-full bg-transparent outline-none duration-200 caret-[#EFF7CF] placeholder:text-[#EFF7CF] text-[#EFF7CF] border-b-2"
                        type="text"
                        bind:value={emailId}
                    /> -->
                    <select
                        class="font-yatra p-2 mt-5 max-sm:text-lg placeholder:max-md:text-lg w-full bg-[#1C1337] outline-none duration-200 caret-[#EFF7CF] placeholder:text-[#EFF7CF] text-[#EFF7CF] border-b-2"
                        bind:value={passType}
                    >
                        <option value="" selected disabled>Pass Type</option>
                        <option value="CLTR_PRO"
                            >Proshow and Cultural Events</option
                        >
                        <option value="SUP_PRO"
                            >Superpass Proshow + Cultural</option
                        >
                        <option value="CLTR_BOB">Battle Of Bands</option>
                        <option value="CLTR_GRD">Group Dance</option>
                        <option value="CLTR_FAS">Fashion Show</option>
                        <option value="ESPORTS">ESports</option>\
                        <option value="SPORT_FB_M">Men's Football</option>
                        <option value="SPORT_VB_M">Men's Volleyball</option>
                        <option value="SPORT_TN_M">Men's Tennis</option>
                        <option value="SPORT_TT_M">Men's Table Tennis</option>
                        <option value="SPORT_BB_F">Women's Basketball</option>
                        <option value="SPORT_TB_F">Women's Throwball</option>
                        <option value="SPORT_TN_F">Women's Tennis</option>
                        <option value="SPORT_TT_F">Women's Table Tennis</option>
                        <option value="SPORT_ATH">Athletics</option>
                        <option value="SPORT_CHS">Chess</option>
                    </select>
                </div>
            </div>
            <button
                class="w-fit font-normal text-center bg-[#EFF7CF] py-1 px-5 text-md mt-[35px] mb-3 hover:scale-110 active:scale-95 disabled:opacity-50 opacity-100 disabled:scale-100 scale-105 transition-all duration-100 rounded-xl"
            >
                <div
                    class=" w-full text-center text-lg font-normal text-[#1C1337] font-yatra"
                >
                    Submit
                </div>
            </button>
        </div>
    </div>
</form>

<div class="flex justify-center item-center w-full p-2">
    {#if form?.success}
        <div
            class="flex flex-col  h-[300px] items-center justify-center group divide-y divide-[#EFF7CF] divide-y-4 divide-solid"
        >
            <p
                class="text-[#EFF7CF] font-yatra text-2xl font-bolder tracking-wider text-center"
            >
                {form.url}
            </p>
        </div>
    {/if}
</div>
