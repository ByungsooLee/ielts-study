import type { ContentRecord, Domain, StudyItem } from "../types";

export function itemDomain(item: StudyItem): Domain {
  return item.domain === "engineering" ? "engineering" : "english";
}

export function isEnglishRecord(record: ContentRecord): boolean {
  return itemDomain(record.item) === "english";
}

export function isEngineeringRecord(record: ContentRecord): boolean {
  return itemDomain(record.item) === "engineering";
}

export function filterEnglishRecords(records: ContentRecord[]): ContentRecord[] {
  return records.filter(isEnglishRecord);
}

export function filterEngineeringRecords(records: ContentRecord[]): ContentRecord[] {
  return records.filter(isEngineeringRecord);
}
