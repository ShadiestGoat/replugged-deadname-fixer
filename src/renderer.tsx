import { common, components } from "replugged";
import { ASTNode, ParserRule, ReactOutputRule } from "simple-markdown";
const { parser } = common;
const { Tooltip } = components;
import "./style.css";
import { cfg } from "./settings/common";

export const deadnameRule: ParserRule & ReactOutputRule = {
  order: parser.defaultRules.mention.order - 1,
  match(source) {
    const deadnames = cfg.get("deadnames", []).filter((v) => v.length);
    if (deadnames.length == 0 || !cfg.get("realName")) {
      return null;
    }

    const reg = new RegExp(`^.*(?<!\\w)(${deadnames.join("|")})(?!\\w)`, "ims");
    return reg.exec(source);
  },
  parse(capture, parse, state) {
    const deadnames = cfg.get("deadnames", []).filter((v) => v.length);
    const reg = new RegExp(`(?<!\\w)(${deadnames.join("|")})(?!\\w)`, "gims");

    const matcher = Array.from(capture[0].matchAll(reg));

    let resp = [] as ASTNode;
    let lastIndex = 0;

    matcher.forEach((v) => {
      resp.push(parse(capture[0].slice(lastIndex, v.index), state));
      resp.push({
        content: v[0],
        type: "deadname",
      });

      lastIndex = v.index! + v[0].length;
    });

    return resp;
  },
  react(node) {
    const { content } = node as unknown as { content: string };

    // we already verified it exists, but... just to make sure....
    let realName = cfg.get("realName", "wowzers");

    if (cfg.get("preserveCasing")) {
      realName = realName.toLowerCase();

      if (content.toUpperCase() == content) {
        realName = realName.toUpperCase();
      } else if (content[0].toUpperCase() == content[0]) {
        realName = realName[0].toUpperCase() + realName.slice(1);
      }
    }

    return (
      <Tooltip text={content}>
        <span className="md-deadname">{realName}</span>
      </Tooltip>
    );
  },
};
