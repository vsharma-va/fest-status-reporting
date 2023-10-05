import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
    event.cookies.delete("mongoDbUri");
    throw redirect(302, '/');
};
