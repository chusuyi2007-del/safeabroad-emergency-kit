"use client";

import { emptyKit } from "./defaults";
import { supabase } from "./supabase";
import type { KitRecord } from "./types";
import { ensureWorkspace } from "./workspace";

const storageKey = (token: string) => `safeabroad-kit-${token}`;

export async function createKit(): Promise<KitRecord> {
  const kit = emptyKit();
  await saveKit(kit);
  return kit;
}

export async function loadKit(token: string): Promise<KitRecord | null> {
  if (supabase) {
    const { data, error } = await supabase
      .from("emergency_kits")
      .select("kit")
      .eq("token", token)
      .maybeSingle();

    if (!error && data?.kit) {
      return ensureWorkspace(data.kit as KitRecord);
    }
  }

  const raw = localStorage.getItem(storageKey(token));
  return raw ? ensureWorkspace(JSON.parse(raw) as KitRecord) : null;
}

export async function saveKit(kit: KitRecord): Promise<KitRecord> {
  const next = ensureWorkspace({ ...kit, updatedAt: new Date().toISOString() });

  localStorage.setItem(storageKey(next.token), JSON.stringify(next));

  if (supabase) {
    await supabase.from("emergency_kits").upsert({
      token: next.token,
      kit: next,
      updated_at: next.updatedAt
    });
  }

  return next;
}

export async function deleteKit(token: string): Promise<void> {
  localStorage.removeItem(storageKey(token));

  if (supabase) {
    await supabase.from("emergency_kits").delete().eq("token", token);
  }
}
