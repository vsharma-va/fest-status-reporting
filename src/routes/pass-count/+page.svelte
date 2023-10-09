<script>
    export let data;
</script>

{#if data.authorised}
    <div
        class="w-full h-full flex flex-col sm:flex-row justify-center items-center flex-wrap gap-5 md:flex-row md:gap-5"
    >
        {#each Object.entries(data.passOccuranceMap) as [passName, occurance]}
            <div
                class="flex flex-col w-[80%] sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/5 h-[300px] items-center justify-center group divide-y divide-[#EFF7CF] divide-y-4 divide-solid"
            >
                <div
                    class="w-[100%] h-full bg-[#1C1337] h-[300px] border-[1px] mt-10 rounded-xl flex flex-col items-center justify-center shadow-[5px_5px_0px_0px_rgba(239,247,207,1)]"
                >
                    <p
                        class="text-[#EFF7CF] font-yatra text-2xl font-bolder tracking-wider text-center"
                    >
                        {passName}
                    </p>
                    <p
                        class="text-[#EFF7CF] font-yatra text-lg font-bold tracking-wider text-center"
                    >
                        {occurance[1]}
                    </p>
                </div>
                <div
                    class="bg-[#1C1337] h-[200px] w-[80%] rounded-bl-xl rounded-br-xl border-[1px] border-solid flex flex-col items-center justify-center shadow-[5px_5px_0px_0px_rgba(239,247,207,1)]"
                >
                    <p
                        class="text-[#EFF7CF] font-yatra text-3xl font-bolder tracking-widest text-center"
                    >
                        {occurance[0]}
                    </p>
                </div>
            </div>
        {/each}
    </div>
{:else}
    <div class="h-screen flex items-center justify-center">
        <p class=" font-yatra text-[#EFF7CF] text-4xl text-wider">
            UNAUTHORISED
        </p>
    </div>
{/if}
