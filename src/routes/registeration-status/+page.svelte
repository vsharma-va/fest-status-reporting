<script>
    import { enhance } from "$app/forms";

    export let data;
    export let form;

    let eventId = "";
    let pageNumber = 0;
    const pageSize = 5;

    //@ts-ignore
    function submit({ formData }) {
        if (eventId) {
            formData.set("eventName", eventId);
            formData.set("pageNumber", pageNumber);
        }
    }
</script>

{#if data.authorised}
    <form
        method="post"
        use:enhance={(event) => {
            submit(event);
            pageNumber = 0;
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
                    Select an event whose registerations you want to see
                </div>
                <select
                    class="font-yatra p-2 mt-5 max-sm:text-lg placeholder:max-md:text-lg w-full bg-[#1C1337] outline-none duration-200 caret-[#EFF7CF] placeholder:text-[#EFF7CF] text-[#EFF7CF] border-b-2"
                    bind:value={eventId}
                >
                    <option value="" selected disabled>Event Name</option>
                    {#each data.events as event}
                        <option value={event.strapiId}>{event.name}</option>
                    {/each}
                </select>
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
        {#if form.success && !form.team}
            <div
                class="flex flex-col items-center justify-center mt-5 flex-wrap gap-5 rounded-xl px-5 sm:px-[125px] md:mt-10 md:px-[0px] md:flex-row"
            >
                {#each form.registrationObj as regObj}
                    <div
                        class="bg-[#1C1337] text-[#EFF7CF] border-[1px] shadow-[5px_5px_0px_0px_rgba(239,247,207,1)] w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/4 h-[200px] text-xl flex flex-col items-center justify-center rounded-xl"
                    >
                        <p class="font-yatra">{regObj.email}</p>
                        <p class="font-yatra">{regObj.name}</p>
                        <p class="font-yatra">{regObj.phone}</p>
                        <p class="font-yatra">{regObj.mahe}</p>
                        <p class="font-yatra">{regObj.institute}</p>
                    </div>
                {/each}
            </div>
        {:else}
            <div
                class="flex flex-col md:flex-row items-center justify-center mt-5 flex-wrap gap-10 lg:gap-2 rounded-xl px-5 sm:px-[125px] md:mt-10 md:px-[0px] md:flex-row"
            >
                {#each Object.entries(form.registrationObj) as [teamNumber, memberArray]}
                    <div class="flex flex-col items-center justify-center w-full px-5 md:w-1/2 lg:w-1/3">
                        {#each memberArray as memberObj}
                            <div
                                class="bg-[#1C1337] text-[#EFF7CF] border-[1px] shadow-[5px_5px_0px_0px_rgba(239,247,207,1)] w-full h-[200px] text-xl flex flex-col items-center justify-center rounded-xl"
                            >
                            <p class="font-yatra">{teamNumber}</p>
                                <p class="font-yatra">{memberObj.email}</p>
                                <p class="font-yatra">{memberObj.name}</p>
                                <p class="font-yatra">{memberObj.phone}</p>
                                <p class="font-yatra">
                                    MAHE Student: {memberObj.mahe}
                                </p>
                                <p class="font-yatra">{memberObj.institute}</p>
                            </div>
                        {/each}
                    </div>
                {/each}
            </div>
        {/if}
        <div
            class="flex flex-row items-center justify-center mt-[50px] flex-wrap gap-5 rounded-xl"
        >
            <form
                method="post"
                use:enhance={(event) => {
                    submit(event);
                    return async ({ update }) => {
                        update({ reset: false });
                    };
                }}
            >
                {#if form.registrationObj.length == pageSize}
                    <button
                        class="w-fit font-normal text-center bg-[#EFF7CF] py-1 px-5 text-md mt-[35px] mb-3 hover:scale-110 active:scale-95 disabled:opacity-50 opacity-100 disabled:scale-100 scale-105 transition-all duration-100 rounded-xl"
                        on:click={() => {
                            pageNumber += 1;
                            console.log(pageNumber);
                        }}
                        ><div
                            class=" w-full text-center text-lg font-normal text-[#1C1337] font-yatra"
                        >
                            Next
                        </div></button
                    >
                {/if}
                {#if !form.firstPage}
                    <button
                        class="w-fit font-normal text-center bg-[#EFF7CF] py-1 px-5 text-md mt-[35px] mb-3 hover:scale-110 active:scale-95 disabled:opacity-50 opacity-100 disabled:scale-100 scale-105 transition-all duration-100 rounded-xl"
                        on:click={() => {
                            pageNumber -= 1;
                            console.log(pageNumber);
                        }}
                        ><div
                            class=" w-full text-center text-lg font-normal text-[#1C1337] font-yatra"
                        >
                            Prev
                        </div></button
                    >
                {/if}
            </form>
        </div>
    {/if}
{/if}
