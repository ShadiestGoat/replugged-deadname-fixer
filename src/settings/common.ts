import { settings } from "replugged";

export interface Settings {
  enableTooltip: boolean;
  preserveCasing: boolean;
  deadnames: string[];
  realName: string;
}

export const defaultSettings = {
  enableTooltip: false,
  preserveCasing: true,
} satisfies Partial<Settings>;

export const cfg = await settings.init<Settings, keyof typeof defaultSettings>(
  "eu.shadygoat.DeadnameFixer",
  defaultSettings,
);
