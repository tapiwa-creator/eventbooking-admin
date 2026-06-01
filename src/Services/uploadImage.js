import { supabase } from "../supabaseClient";

export async function uploadEventImage(file) {
    const fileName = `events/${Date.now()}-${file.name}`;

    const { error } = await supabase
        .storage
        .from("event-images")
        .upload(fileName, file);



        
    if (error) {
        throw new Error(error.message);
    }

    const { data: publicUrlData } = supabase
        .storage
        .from("event-images")
        .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
}
