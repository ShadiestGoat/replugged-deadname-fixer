import { Injector, common } from "replugged";
import { ParserRule, ReactOutputRule } from "simple-markdown";
import { deadnameRule } from "./renderer";

const { parser } = common;

const inject = new Injector();

export function start(): void {
  (parser.defaultRules as Record<string, ParserRule & ReactOutputRule>).deadname = deadnameRule;
  parser.parse = parser.reactParserFor(parser.defaultRules);
}

export function stop(): void {
  inject.uninjectAll();

  delete (parser.defaultRules as Record<string, ParserRule & ReactOutputRule>).deadname;
  parser.parse = parser.reactParserFor(parser.defaultRules);
}

export { Settings } from "./settings/settings";
