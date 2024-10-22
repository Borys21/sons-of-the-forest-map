import { createElement } from "../lib/elements";
import { t } from "../lib/i18n";
import { getItem, setItem } from "../lib/storage";

export function JoinCommunity() {
  const hideJoinCommunity = getItem("hide_join_community", false);
  if (hideJoinCommunity) {
    return;
  }
  const actions = createElement(
    "div",
    {
      className: "group",
      innerHTML: `
    <a href="https://discord.com/invite/NTZu8Px" target="_blank" class="button discord">
        ${t("Join our Discord")}
      </a>
      <a href="https://discord.gg/6JFVjYjrF4" target="_blank" class="button discord">
        ${t("Join German community")}
      </a>
    `,
    },
    [
      createElement("button", {
        className: "button",
        innerText: t("Do not show again"),
        onclick: () => {
          element.remove();
          setItem("hide_join_community", true);
        },
      }),
    ]
  );
  const element = createElement(
    "section",
    {
      className: "join-community paper",
      innerHTML: `
    <h2>
      <svg>
        <use xlink:href="#window-control_discord" />
      </svg>
      <span>${t("Join the community")}</span>
    </h2>
    <p class="description">
      ${t(
        "Discuss latest updates, ask questions and share your ideas with other players."
      )}
    </p>
    `,
    },
    [
      actions,
      createElement("button", {
        className: "close",
        innerHTML: `<svg width="1.5em" height="1.5em">
        <use xlink:href="#icon-close" />
      </svg>`,
        onclick: () => {
          element.remove();
        },
      }),
    ]
  );

  document.querySelector(".layout")!.append(element);
}
