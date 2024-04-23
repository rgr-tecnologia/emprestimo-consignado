import { SPHttpClient } from "@microsoft/sp-http";
import { SPGroup } from "../types/SpGroup/SpGroup";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";

export async function getCurrentUserGroups(
  context: FormCustomizerContext
): Promise<SPGroup[]> {
  const queryUrl = `${context.pageContext.web.absoluteUrl}/_api/web/currentuser/groups`;
  const siteGroupsData = await context.spHttpClient.get(
    queryUrl,
    SPHttpClient.configurations.v1
  );
  const siteGroups = (await siteGroupsData.json()).value;

  return siteGroups;
}
