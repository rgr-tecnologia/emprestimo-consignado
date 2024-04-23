import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import { getCurrentUserGroups } from "./getCurrentUserGroups";

export async function isMemberOfGroup(
  groupId: number,
  context: FormCustomizerContext
): Promise<boolean> {
  const userGroups = await getCurrentUserGroups(context);
  const group = userGroups.find(
    (group: { Id: number }) => group.Id === groupId
  );
  return !!group;
}
