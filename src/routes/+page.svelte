<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { signIn } from "@auth/sveltekit/client";

    export let data;

    if (browser) {
        if (data.loggedIn) {
            setTimeout(() => {
                goto("/pass-count");
            }, 2000);
        } else {
            setTimeout(() => {
                signIn("google", { callbackUrl: "/pass-count" });
            }, 2000);
        }
    }
</script>

<div class="flex flex-col w-full h-full items-center justify-center">
    {#if data.loggedIn}
        <div class="font-yatra text-4xl tracking-wider text-[#EFF7CF] mt-[20%]">
            REDIRECTING...
        </div>
    {:else}
        <div
            class="font-yatra text-4xl tracking-wider text-[#EFF7CF] text-center mt-[20%]"
        >
            REDIRECTING to login page...
        </div>
    {/if}
</div>
