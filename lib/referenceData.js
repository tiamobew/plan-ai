export const REFERENCE_STORAGE_KEY = "plan_ai_reference_data_v1";

export const CSV_COLUMNS = [
  "curriculum_version", "subject_group", "course_code", "course_name", "grade",
  "learning_type", "standard_code", "learning_code", "learning_text", "school_name",
  "teacher_name", "teacher_position", "director_name", "director_position", "sort_order", "active",
];

export function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i], next = text[i + 1];
    if (ch === '"' && quoted && next === '"') { cell += '"'; i += 1; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === "," && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") i += 1;
      row.push(cell.trim()); cell = "";
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) return [];
  const headers = rows[0].map((x) => x.replace(/^\uFEFF/, ""));
  return rows.slice(1).map((values, index) => {
    const item = { id: `${Date.now()}-${index}` };
    headers.forEach((header, i) => { item[header] = values[i] || ""; });
    item.sort_order = Number(item.sort_order || index + 1);
    item.active = !["false", "0", "no"].includes(String(item.active).toLowerCase());
    return item;
  });
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(items) {
  return [CSV_COLUMNS.join(","), ...items.map((item) => CSV_COLUMNS.map((key) => csvCell(item[key])).join(","))].join("\r\n");
}

export function uniqueValues(items, key, filter = {}) {
  return [...new Set(items.filter((x) => x.active !== false && Object.entries(filter).every(([k, v]) => !v || x[k] === v)).map((x) => x[key]).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), "th", { numeric: true }));
}

