import { common, components, util } from "replugged";
import { cfg, defaultSettings } from "./common";
const { useState } = common.React;
const { TextInput, Text, Button, Flex, SwitchItem, Notice } = components;
import "./settings.css";

export function Settings(): React.ReactElement {
  return (
    <Flex style={{ gap: "2vh", flexDirection: "column" }}>
      <Notice messageType={Notice.Types.INFO}>
        All names are case-insensitive!
      </Notice>

      <SwitchItem
        {...util.useSetting(cfg, "preserveCasing", defaultSettings.preserveCasing)}
        note="If enabled, it'll try to keep ALL CAPS/Capitalize/all lower casing">
        Preserve Casing
      </SwitchItem>
      <SwitchItem
        {...util.useSetting(cfg, "enableTooltip", defaultSettings.enableTooltip)}
        note="If enabled, you can hover over the replaced text to view original content">
        Enable Tooltip
      </SwitchItem>

      <Flex direction={Flex.Direction.VERTICAL}>
        <TitleSub title="Your Name" explanation="This is your chosen name. If Preserve Casing is enabled, this is case insensitive." />
        <TextInput
          className="option-text-inp"
          placeholder="Real Name"
          title="Real Name"
          {...util.useSetting(cfg, "realName")}
        />
      </Flex>

      <Summary title="Deadnames">
        <DeadnameOpt />
      </Summary>
    </Flex>
  );
}

export function TitleSub({
  title,
  explanation,
}: {
  title: string;
  explanation: string;
}): React.ReactElement {
  return (
    <>
      <Text variant="heading-xl/bold" selectable={true}>
        {title}
      </Text>
      <Text variant="text-md/normal" selectable={true}>
        {explanation}
      </Text>
    </>
  );
}

export function DeadnameOpt(): React.ReactElement {
  const { value, onChange } = util.useSetting(cfg, "deadnames", [] as string[]);
  const [editLoc, setEditLoc] = useState(-1);
  const [editCache, setEditCache] = useState("");

  const updateValue = (i: number): void => {
    value[i] = editCache;
    setEditLoc(-1);
    setEditCache("");
    onChange([...value]);
  };

  const addValue = (): void => {
    value.push(editCache);
    setEditLoc(-1);
    setEditCache("");
    onChange([...value]);
  };

  return (
    <div>
      <TitleSub title="Your Deadnames" explanation="Please write the name(s) you were given at birth here. These will be replaced. They are case-insensitive" />
      <Flex
        className="deadname-wrapper"
        direction={Flex.Direction.VERTICAL}
        style={{ gap: "2vh" }}>
        {value.map((v, i) => {
          return (
            <Flex direction={Flex.Direction.HORIZONTAL} style={{ gap: "2vw" }}>
              <TextInput
                onChange={setEditCache}
                placeholder="Deadname"
                value={i === editLoc ? editCache : v}
                disabled={i !== editLoc}
              />
              {editLoc === i ? (
                <OpenPlusEditItems
                  disableSave={editCache.length === 0}
                  onSave={() => {
                    updateValue(i);
                  }}
                  onDelete={() => {
                    value.splice(i, 1);
                    onChange([...value]);
                  }}
                  onCancel={() => {
                    setEditLoc(-1);
                    setEditCache("");
                  }}
                />
              ) : (
                <Button
                  onClick={() => {
                    setEditLoc(i);
                    setEditCache(v);
                  }}
                  color={Button.Colors.BRAND}>
                  Edit
                </Button>
              )}
            </Flex>
          );
        })}
        {editLoc === -2 ? (
          <Flex direction={Flex.Direction.HORIZONTAL} style={{ gap: "2vw" }}>
            <TextInput onChange={setEditCache} placeholder="Deadname" value={editCache} />
            <OpenPlusEditItems
              disableSave={editCache.length === 0}
              onSave={addValue}
              onDelete={() => {
                setEditLoc(-1);
                setEditCache("");
              }}
            />
          </Flex>
        ) : (
          ""
        )}
        <Button
          onClick={() => {
            setEditLoc(-2);
            setEditCache("");
          }}>
          +
        </Button>
      </Flex>
    </div>
  );
}

function OpenPlusEditItems({
  onSave,
  disableSave,
  onDelete,
  onCancel,
}: {
  onSave: () => void;
  disableSave: boolean;
  onDelete: () => void;
  onCancel?: () => void;
}): React.ReactElement {
  return (
    <>
      <Button onClick={onSave} color={Button.Colors.GREEN} disabled={disableSave}>
        💾
      </Button>
      {onCancel ? (
        <Button onClick={onCancel} color={Button.Colors.YELLOW}>
          X
        </Button>
      ) : (
        ""
      )}
      <Button onClick={onDelete} color={Button.Colors.RED}>
        🗑️
      </Button>
    </>
  );
}

export function Summary({
  title,
  children,
}: {
  title: string;
  children: React.ReactElement | React.ReactElement[];
}): React.ReactElement {
  return (
    <>
      <details className="shady-details">
        <summary className="shady-summary">
          <Text variant="heading-xxl/bold" selectable={true}>
            {title}
          </Text>
        </summary>
        {children}
      </details>
    </>
  );
}
