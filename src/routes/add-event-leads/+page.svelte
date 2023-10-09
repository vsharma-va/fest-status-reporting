<script>
    import { enhance } from "$app/forms";

    export let data;
    export let form;

    let emailId = "";

    //@ts-ignore
    function submit({ formData }) {
        if (emailId) {
            formData.set("emailId", emailId);
        }
    }
</script>

{#if data.authorised}
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
                class="bg-[#1C1337] relative p-2 border-[1px] border-white max-md:font-semibold text-center max-md:text-md z-[9] max-w-[30%] max-sm:max-w-[70%] max-xs:max-w-[90%] max-md:max-w-[50%] max-md:text-sm max-xl:max-w-[40%] max-md:my-[20%] overflow-hidden"
            >
                <div
                    class="font-yatra text-center uppercase font-bold text-[#EFF7CF] text-xl p-2"
                >
                    Enter the GMAIL id of the event lead
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
    {#if form}
        <div class="flex flex-row justify-center items-center">
            <p class="font-yatra text-2xl text-[#EFF7CF]">{form.reason}</p>
        </div>
    {/if}
{/if}
