<script>
    import { enhance } from "$app/forms";
    import { CSVDownloader } from "svelte-csv";

    export let data;
    export let form;

    let dataType = "";
    let eventName = "";

    //@ts-ignore
    function submit({ formData }) {
        if (form) {
            form.success = false;
        }
        if (dataType) {
            if (dataType == "event") {
                if (eventName) {
                    formData.set("dataType", dataType);
                    formData.set("eventName", eventName);
                }
            } else if (dataType == "pass") {
                formData.set("dataType", dataType);
            }
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
                    Select Which Data You Want To Export
                </div>
                <select
                    class="font-yatra p-2 mt-5 max-sm:text-lg placeholder:max-md:text-lg w-full bg-[#1C1337] outline-none duration-200 caret-[#EFF7CF] placeholder:text-[#EFF7CF] text-[#EFF7CF] border-b-2"
                    bind:value={dataType}
                >
                    <option value="" selected disabled>Data Type</option>
                    <option value="event">Single Event Data</option>
                    <option value="pass">Pass Holder Data</option>
                </select>
                {#if dataType === "event"}
                    <select
                        class="font-yatra p-2 mt-5 max-sm:text-lg placeholder:max-md:text-lg w-full bg-[#1C1337] outline-none duration-200 caret-[#EFF7CF] placeholder:text-[#EFF7CF] text-[#EFF7CF] border-b-2"
                        bind:value={eventName}
                    >
                        <option value="" selected disabled>Event Name</option>
                        {#each data.events as event}
                            <option value={event.strapiId}>{event.name}</option>
                        {/each}
                    </select>
                {/if}
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
        {#if form.success}
            <div
                class="text-white flex flex-row justify-center items-center font-yatra text-4xl mt-[30px] hover:text-white underline visited:text-purple-600 hover:-translate-x-1 hover:-translate-y-1 duration-150"
            >
                <CSVDownloader
                    data={form.csvData}
                    filename={form.fileName}
                    bom={true}
                >
                    Download {form.fileName}
                </CSVDownloader>
            </div>
        {/if}
    {/if}
{:else}
    <div class="flex flex-col justify-center items-center">Unauthorised</div>
{/if}
{#if form}
    {#if !form.success && form.tryAgain}
        <div
            class="flex flex-col justify-center items-center font-yatra text-3xl text-[#EfF7CF] mt-[20px]"
        >
            Try Again in {form.tryAgainIn} Minutes
        </div>
    {/if}
{/if}
