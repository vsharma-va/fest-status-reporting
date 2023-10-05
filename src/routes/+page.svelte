<script>
    import { enhance } from "$app/forms";

    export let data;
    export let form;

    let mongoDbUri = "";

    //@ts-ignore
    function submit({ formData }) {
        if (mongoDbUri) {
            formData.set("mongoDbUri", mongoDbUri);
        }
    }
</script>

{#if !data.success && form == null}
    <form
        method="post"
        use:enhance={(event) => {
            submit(event);
            return async ({ update }) => {
                update({ reset: false });
            };
        }}
    >
        <div
            class=" fixed top-0 left-0 z-[11] w-screen max-xs:w-[700px] h-screen flex items-center justify-center font-normal fadeinSlow"
        >
            <div
                class=" bg-[#1C1337] relative p-2 border-[1px] border-white max-md:font-semibold text-center max-md:text-md z-[9] max-w-[30%] max-sm:max-w-[70%] max-xs:max-w-[90%] max-md:max-w-[50%] max-md:text-sm max-xl:max-w-[40%] max-md:my-[20%] overflow-hidden"
            >
                <div
                    class="font-yatra text-center uppercase font-bold text-[#EFF7CF] text-xl p-2"
                >
                    Enter the Mongo DB URL
                </div>

                <!--inputs-->
                <div class=" text-white font-extralight">
                    <div class="mt-[20px] px-4 sm:px-6">
                        <input
                            placeholder="Mongo Db URL"
                            class=" font-yatra p-2 max-sm:text-lg placeholder:max-md:text-lg w-full bg-transparent outline-none duration-200 caret-[#EFF7CF] placeholder:text-[#EFF7CF] text-[#EFF7CF] border-b-2"
                            type="text"
                            bind:value={mongoDbUri}
                        />
                    </div>
                </div>
                <button
                    class="w-fit font-normal text-center bg-[#EFF7CF] py-1 px-5 text-md mt-[35px] mb-3 hover:scale-110 active:scale-95 disabled:opacity-50 opacity-100 disabled:scale-100 scale-105 transition-all duration-100 rounded-xl"
                >
                    <div
                        class=" w-full text-center text-lg font-normal text-[#1C1337] font-yatra"
                    >
                        Set
                    </div>
                </button>
            </div>
            <button
                class=" pointer-events-auto fixed backdrop-blur-md top-0 left-0 h-screen w-screen cursor-pointer fadeinSlow"
                type="submit"
            />
        </div>
    </form>
{/if}

<div
    class="w-full h-full flex flex-col sm:flex-row justify-center items-center flex-wrap gap-5 md:flex-row md:gap-5"
>
    {#if data?.success}
        {#each Object.entries(data.passOccuranceMap) as [passName, occurance]}
            <div
                class="flex flex-col w-[80%] sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/5 h-[300px] items-center justify-center group divide-y divide-[#EFF7CF] divide-y-4 divide-solid"
            >
                <div
                    class="w-[100%] h-full bg-[#1C1337] h-[300px] border-[1px] mt-10 rounded-xl flex flex-col items-center justify-center shadow-[5px_5px_0px_0px_rgba(239,247,207,1)] -translate-x-1 -translate-y-1 transition ease-out duration-300"
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
                    class="bg-[#1C1337] h-[200px] w-[80%] rounded-bl-xl rounded-br-xl border-[1px] border-solid flex flex-col items-center justify-center shadow-[5px_5px_0px_0px_rgba(239,247,207,1)] -translate-x-1 -translate-y-1 transition ease-out duration-300"
                >
                    <p
                        class="text-[#EFF7CF] font-yatra text-3xl font-bolder tracking-widest text-center"
                    >
                        {occurance[0]}
                    </p>
                </div>
            </div>
        {/each}
    {/if}
</div>
