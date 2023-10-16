<script>
    import hamburger from "../assets/hamburger-md-svgrepo-com.svg";

    import closebtn from "../assets/circle-xmark-regular.svg";

    import { navigating, page } from "$app/stores";
    import { signOut } from "@auth/sveltekit/client";

    // @ts-ignore
    let menu;
    let menubackdrop;
    let menubtn;

    const closeMenu = async () => {
        menubtn.hidden = false;
        menu.classList.remove("menumoveinleft");
        menubackdrop.classList.remove("blurinmenubkd");
        menu.classList.add("menumoveoutleft");
        menubackdrop.classList.add("bluroutmenubkd");
        setTimeout(() => {
            menu.hidden = true;
            menubackdrop.hidden = true;
            menu.classList.add("menumoveinleft");
            menubackdrop.classList.add("blurinmenubkd");
            menubackdrop.classList.remove("bluroutmenubkd");
            menu.classList.remove("menumoveoutleft");
        }, 270);
    };

    const openMenu = async () => {
        menu.classList.add("menumoveinleft");
        menubackdrop.classList.add("blurinmenubkd");
        menubackdrop.classList.remove("bluroutmenubkd");
        menu.classList.remove("menumoveoutleft");
        menu.hidden = false;
        menubackdrop.hidden = false;
        menubtn.hidden = true;
    };

    $: if ($navigating) closeMenu();

    // @ts-ignore
</script>

<!--Navbox new-->
<button
    class="z-[500] fixed top-0 left-0"
    on:click={openMenu}
    bind:this={menubtn}
>
    <img src={hamburger} width="50px" />
</button>
<div
    bind:this={menu}
    class="menumoveoutleft fixed bg-opacity-30 text-white top-0 left-0 h-[100dvh] md:w-[35%] lg:w-[25%] w-[100%] bg-black z-[500]"
    hidden
>
    <button
        class="ml-4 absolute right-0 top-0 mt-2 mr-2 p-1 rounded-full bg-black bg-opacity-30 active:bg-white active:bg-opacity-25 transition-all duration-150"
        on:click={closeMenu}
    >
        <img src={closebtn} width="30px" />
    </button>
    <div class=" w-full h-full flex items-center justify-center">
        <div class="flex flex-col justify-center items-center gap-7">
            <a
                href="/pass-count"
                class="font-yatra text-xl tracking-wider border-2 p-2 rounded-xl hover:border-3 hover:rounded-none transition-all ease-out duration-600 text-[#EFF7CF] border-[#EFF7CF]"
            >
                Pass Count
            </a>
            <a
                href="/payment-status"
                class="font-yatra text-xl tracking-wider border-2 p-2 rounded-xl hover:border-3 hover:rounded-none transition-all ease-out duration-600 text-[#EFF7CF] border-[#EFF7CF]"
            >
                Payment Status
            </a>
            <a
                href="/pass-status"
                class="font-yatra text-xl tracking-wider border-2 p-2 rounded-xl hover:border-3 hover:rounded-none transition-all ease-out duration-600 text-[#EFF7CF] border-[#EFF7CF]"
            >
                Pass Status
            </a>
            <a
                href="/generate-callback"
                class="font-yatra text-xl tracking-wider border-2 p-2 rounded-xl hover:border-3 hover:rounded-none transition-all ease-out duration-600 text-[#EFF7CF] border-[#EFF7CF]"
            >
                Generate Callback
            </a>
            <a
                href="/registeration-status"
                class="font-yatra text-xl tracking-wider border-2 p-2 rounded-xl hover:border-3 hover:rounded-none transition-all ease-out duration-600 text-[#EFF7CF] border-[#EFF7CF]"
            >
                Reg Status
            </a>
            <a
                href="/add-event-leads"
                class="font-yatra text-xl tracking-wider border-2 p-2 rounded-xl hover:border-3 hover:rounded-none transition-all ease-out duration-600 text-[#EFF7CF] border-[#EFF7CF]"
            >
                Add Event Leads
            </a>
            <a
                href="/export-data"
                class="font-yatra text-xl tracking-wider border-2 p-2 rounded-xl hover:border-3 hover:rounded-none transition-all ease-out duration-600 text-[#EFF7CF] border-[#EFF7CF]"
            >
                Export Data
            </a>
            <a
                href="/"
                class="font-yatra text-xl tracking-wider border-2 p-2 rounded-xl hover:border-3 hover:rounded-none transition-all ease-out duration-600 text-[#EFF7CF] border-[#EFF7CF]"
                on:click={async () => {
                    await signOut({ callbackUrl: "/" });
                }}
            >
                Switch Account
            </a>
        </div>
    </div>
</div>
<button
    on:click={closeMenu}
    bind:this={menubackdrop}
    class="bluroutmenubkd fixed z-[499] top-0 h-[100lvh] w-[100lvw] backdrop-blur-md cursor-default"
    hidden
/>

<!--End navbox-->

<style>
    .blurinmenubkd {
        animation-name: blurin;
        animation-duration: 300ms;
        animation-fill-mode: forwards;
    }

    .menumoveinleft {
        animation-name: moveinfromleft;
        animation-duration: 300ms;
        animation-fill-mode: forwards;
    }

    .menumoveoutleft {
        animation-name: moveoutfromleft;
        animation-duration: 300ms;
        animation-fill-mode: forwards;
    }

    .bluroutmenubkd {
        animation-name: blurout;
        animation-duration: 300ms;
        animation-fill-mode: forwards;
    }
    @keyframes fadeInAnimation {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes blurin {
        0% {
            backdrop-filter: blur(0px);
        }
        100% {
            backdrop-filter: blur(12px);
        }
    }

    @keyframes blurout {
        100% {
            backdrop-filter: blur(0px);
        }
        0% {
            backdrop-filter: blur(12px);
        }
    }

    @keyframes moveinfromleft {
        0% {
            transform: translateX(-100%);
        }

        100% {
            transform: translateX(0%);
        }
    }

    @keyframes moveoutfromleft {
        100% {
            transform: translateX(-100%);
        }

        0% {
            transform: translateX(0%);
        }
    }
</style>
