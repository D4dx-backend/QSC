const normalizeValue = (value = "") => value.toString().trim().toLowerCase().replace(/\s+/g, " ");

const getSequenceValue = (item) => {
  const sequence = Number(item?.sequence);
  return Number.isFinite(sequence) ? sequence : Number.MAX_SAFE_INTEGER;
};

const sortItems = (items = []) =>
  [...items].sort((firstItem, secondItem) => {
    const sequenceDifference = getSequenceValue(firstItem) - getSequenceValue(secondItem);

    if (sequenceDifference !== 0) {
      return sequenceDifference;
    }

    return normalizeValue(firstItem?.label).localeCompare(normalizeValue(secondItem?.label));
  });

const getNormalizedGroupTitle = (value) => {
  const groupTitle = value?.toString().trim();
  return groupTitle ? groupTitle : null;
};

const isNavigableItem = (item) =>
  Boolean(item && item.menuType !== "title" && typeof item.path === "string" && item.path.trim());

const getFirstNavigableSubMenu = (submenus = []) => sortItems(submenus.filter(isNavigableItem))[0] ?? null;

const getMenuSelection = (item) => {
  const firstSubMenu = getFirstNavigableSubMenu(item?.submenus ?? []);
  const selectedMenu = firstSubMenu ?? (isNavigableItem(item) ? item : null);

  if (!selectedMenu) {
    return null;
  }

  return {
    selectedMenu,
    selectedSubMenu: firstSubMenu ? item : null,
    currentMenu: selectedMenu?.label ?? "dashboard",
  };
};

const groupItems = (items, { resolveGroupTitle }) => {
  const sections = new Map();

  items.forEach((item, index) => {
    if (!item) {
      return;
    }

    const title = getNormalizedGroupTitle(resolveGroupTitle(item));
    const sectionKey = title ?? `__ungrouped__${index}`;

    if (!sections.has(sectionKey)) {
      sections.set(sectionKey, { title, items: [], firstIndex: index });
    }

    sections.get(sectionKey).items.push(item);
  });

  return Array.from(sections.values())
    .sort((firstSection, secondSection) => firstSection.firstIndex - secondSection.firstIndex)
    .map((section) => ({
      ...section,
      key: section.title ?? `section-${section.firstIndex}`,
      items: sortItems(section.items),
    }));
};

const findDashboardSelection = (menu = []) => {
  for (const item of menu) {
    if (isNavigableItem(item) && item.path === "/dashboard") {
      return {
        selectedMenu: item,
        selectedSubMenu: null,
        currentMenu: item.label,
      };
    }

    const dashboardSubMenu = sortItems(item?.submenus ?? []).find((submenu) => isNavigableItem(submenu) && submenu.path === "/dashboard");

    if (dashboardSubMenu) {
      return {
        selectedMenu: dashboardSubMenu,
        selectedSubMenu: item,
        currentMenu: dashboardSubMenu.label,
      };
    }
  }

  return null;
};

export const getGroupedMenuSections = (menu = []) =>
  groupItems(
    menu.filter((item) => item && (item.showInMenu ?? true)),
    {
      resolveGroupTitle: (item) => item?.menuGroup,
    }
  );

export const getGroupedSubMenuSections = (submenus = []) =>
  groupItems(submenus.filter(Boolean), {
    resolveGroupTitle: (item) => item?.menuGroup,
  });

export const getDefaultMenuSelection = (menu = []) => {
  const visibleMenu = menu.filter((item) => item && (item.showInMenu ?? true));
  const dashboardSelection = findDashboardSelection(visibleMenu);

  if (dashboardSelection) {
    return dashboardSelection;
  }

  for (const section of getGroupedMenuSections(visibleMenu)) {
    for (const item of section.items) {
      const selection = getMenuSelection(item);

      if (selection) {
        return selection;
      }
    }
  }

  return {
    selectedMenu: { label: "dashboard", icon: "dashboard", path: "/dashboard" },
    selectedSubMenu: null,
    currentMenu: "dashboard",
  };
};

export const getDefaultMenuPath = (menu = []) => getDefaultMenuSelection(menu).selectedMenu?.path ?? "/dashboard";