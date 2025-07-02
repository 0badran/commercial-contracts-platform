"use server";
import { revalidatePath } from "next/cache";

export default async function revalidatePage(route: string) {
  revalidatePath(route);
}
