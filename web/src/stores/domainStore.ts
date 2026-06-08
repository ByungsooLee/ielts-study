import { create } from "zustand";
import type { Domain } from "../types";

const DOMAIN_KEY = "app-domain";

function loadDomain(): Domain {
  try {
    const raw = localStorage.getItem(DOMAIN_KEY);
    if (raw === "engineering") return "engineering";
  } catch {
    /* ignore */
  }
  return "english";
}

function persistDomain(domain: Domain) {
  localStorage.setItem(DOMAIN_KEY, domain);
}

interface DomainState {
  domain: Domain;
  setDomain: (domain: Domain) => void;
}

export const useDomainStore = create<DomainState>((set) => ({
  domain: loadDomain(),
  setDomain: (domain) => {
    persistDomain(domain);
    set({ domain });
  },
}));
