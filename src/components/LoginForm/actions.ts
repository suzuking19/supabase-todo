"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

interface AuthProvider {
  provider: "google";
}

type Provider = AuthProvider["provider"];

const signInWith = (provider: Provider) => async (): Promise<void> => {
  const supabase = await createClient();

  const auth_callback_url: string = `${process.env.SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  });

  console.log(data);

  if (error) {
    console.log(error);
    return;
  }

  if (data.url) {
    redirect(data.url);
  }
};

const signInWithGoogle = signInWith("google");

const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
};

export { signInWithGoogle, signOut };
