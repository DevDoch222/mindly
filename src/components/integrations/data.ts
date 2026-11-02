export type Category = "Productivity" | "Communication" | "Storage" | "Focus";

export const APPS: { name: string; cat: Category; color: string; desc: string }[] = [
  { name: "Notion", cat: "Productivity", color: "#e9e6df", desc: "Two-way sync with pages and databases." },
  { name: "Slack", cat: "Communication", color: "#f2c4e6", desc: "Save any message as a note in one click." },
  { name: "Calendar", cat: "Productivity", color: "#c3b4ff", desc: "Turn plans into time blocks automatically." },
  { name: "Figma", cat: "Productivity", color: "#ffb98f", desc: "Capture frames and comments as ideas." },
  { name: "Linear", cat: "Productivity", color: "#c9d1ff", desc: "Send plans straight to your issue tracker." },
  { name: "GitHub", cat: "Productivity", color: "#d5d5d5", desc: "Link notes to issues and pull requests." },
  { name: "Gmail", cat: "Communication", color: "#ffc9c2", desc: "Forward emails to your Mindly inbox." },
  { name: "Zoom", cat: "Communication", color: "#b8dcff", desc: "Meeting notes that write themselves." },
  { name: "Dropbox", cat: "Storage", color: "#b8d0ff", desc: "Attach files without leaving your note." },
  { name: "Drive", cat: "Storage", color: "#d9f26b", desc: "Browse and embed docs inline." },
  { name: "iCloud", cat: "Storage", color: "#e2ecf5", desc: "Native backup on every Apple device." },
  { name: "Spotify", cat: "Focus", color: "#a6e6d4", desc: "Focus playlists that start with your timer." },
  { name: "Readwise", cat: "Focus", color: "#f5e3b5", desc: "Your highlights, resurfaced at the right time." },
  { name: "Zapier", cat: "Productivity", color: "#ffd2a8", desc: "Connect Mindly to 6,000+ other apps." },
];

export const monogram = (name: string) => name.slice(0, 2);
