<script>
    import { enhance } from "$app/forms";

    export let form;

    let emailId = "";

    //@ts-ignore
    function submit({ formData }) {
        if (emailId) {
            formData.set("emailId", emailId);
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
            class="bg-[#1C1337] relative p-2 border-[1px] border-white max-md:font-semibold text-center max-md:text-md z-[9] max-w-[30%] max-sm:max-w-[70%] max-xs:max-w-[90%] max-md:max-w-[50%] max-md:text-sm max-xl:max-w-[40%] max-md:my-[20%] overflow-hidden"
        >
            <div
                class="font-yatra text-center uppercase font-bold text-[#EFF7CF] text-xl p-2"
            >
                Enter the email id whose pass status you want to check
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

<div
    class="w-full h-full flex flex-col sm:flex-row justify-center items-center flex-wrap gap-5 md:flex-row md:gap-5"
>
    {#if form?.success}
        {#each form.foundPass as pass, i}
        <div
            class="flex flex-col w-[80%] sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/5 h-[300px] items-center justify-center group divide-y divide-[#EFF7CF] divide-y-4 divide-solid"
        >
            <div
                class="w-[100%] h-full bg-[#1C1337] h-[300px] border-[1px] mt-10 rounded-xl flex flex-col items-center justify-center shadow-[5px_5px_0px_0px_rgba(239,247,207,1)] -translate-x-1 -translate-y-1 transition ease-out duration-300"
            >
                <!-- <p
                    class="text-[#EFF7CF] font-yatra text-2xl font-bolder tracking-wider text-center"
                >
                    {form.foundPass.email}
                </p> -->
                <p
                    class="text-[#EFF7CF] font-yatra text-2xl font-bolder tracking-wider text-center"
                >
                    {pass.type}
                </p>
            </div>
            <div
                class="bg-[#1C1337] h-[200px] w-[80%] rounded-bl-xl rounded-br-xl border-[1px] border-solid flex flex-col items-center justify-center shadow-[5px_5px_0px_0px_rgba(239,247,207,1)] -translate-x-1 -translate-y-1 transition ease-out duration-300"
            >
                <p
                    class="text-[#EFF7CF] font-yatra text-3xl font-bolder tracking-widest text-center"
                >
                    {pass.generated}
                </p>
            </div>
        </div>
    {:else}
        <div
            class="flex flex-col w-1/4 h-[300px] items-center justify-center group divide-y divide-[#EFF7CF] divide-y-4 divide-dashed"
        >
            <p
                class="text-[#EFF7CF] font-yatra text-3xl font-bolder tracking-widest text-center"
            >
                No Passes Found
            </p>
        </div>
    {/if}
</div>
