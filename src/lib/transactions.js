const STORAGE_KEY = "smarf_transactions";
export const TX_UPDATED_EVENT = "smarf-tx-updated";

export function getTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addTransaction(tx) {
  const current = getTransactions();

  if (tx.hash && current.some((t) => t.hash === tx.hash)) {
    return;
  }

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    time: new Date().toLocaleString(),
    status: "Confirmed",
    ...tx,
  };

  const updated = [entry, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event(TX_UPDATED_EVENT));
  return entry;
}