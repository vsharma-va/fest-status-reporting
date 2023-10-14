<!-- <script>
    export let data;
</script>

{#if data.authorised}
    <form
        method="post"
        use:enhance={(event) => {
            pageNumber = 0;
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
{:else}
    <div class="flex flex-col justify-center items-center">Unauthorised</div>
{/if} -->
