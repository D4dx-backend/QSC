# EventHex List Component Documentation

The List component is a versatile and feature-rich data display system that serves as the backbone for presenting structured data throughout the EventHex SaaS application. It provides built-in CRUD operations, filtering, and custom actions with minimal configuration.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Component Selection](#component-selection)
3. [Common Props](#common-props)
4. [ListItems Specific Props (Multiple Records)](#listitems-specific-props-multiple-records)
5. [ListItem Specific Props (Single Record)](#listitem-specific-props-single-record)
6. [Advanced Features](#advanced-features)
7. [Usage Examples](#usage-examples)
8. [Attribute Types](#attribute-types)
9. [Event Handling](#event-handling)
10. [Nested Elements and SubLists](#nested-elements-and-sublists)

## Basic Usage

```jsx
import ListTable from "../components/core/list/list";

// Basic usage
const MyComponent = () => {
  return (
    <ListTable
      api="/api/v1/events"
      shortName="Event"
      attributes={[
        { name: "title", label: "Event Name", type: "text" },
        { name: "startDate", label: "Start Date", type: "datetime" },
      ]}
    />
  );
};
```

## Component Selection

The `ListTable` component automatically selects between two rendering modes:

- **ListItems**: Multiple records view (default)
- **ListItem**: Single record detailed view

```jsx
// For multiple items list view
<ListTable api="/api/v1/events" />

// For single item view
<ListTable isSlug={true} api="/api/v1/events" />
```

## Common Props

These props are applicable to both `ListItems` and `ListItem` components:

```jsx
<ListTable
  // API endpoint configuration
  api="/api/v1/events" // API endpoint for data fetching
  listApi="/api/v1/events/list" // Optional separate API for listing
  createApi="/api/v1/events/create" // Optional separate API for creation
  updateApi="/api/v1/events/update" // Optional separate API for updates
  deleteApi="/api/v1/events/delete" // Optional separate API for deletion
  // Display configuration
  shortName="Event" // Singular name of the item
  pluralName="Events" // Plural name of items
  itemTitle={{ type: "text", name: "title" }} // Field to use as item title
  itemDescription={{ type: "datetime", name: "startDate" }} // Secondary display field
  icon="calendar" // Icon to display
  profileImage="logo" // Field to use as profile image
  // Permissions
  createPrivilege={true} // Allow creation
  updatePrivilege={true} // Allow updates
  delPrivilege={true} // Allow deletion
  showPrivilege={true} // Allow viewing
  // Form configuration
  formMode="popup" // "popup", "page", "single", "inline", "double"
  popupMode="medium" // "small", "medium", "large", "fullscreen", "full-page"
  popupMenu="vertical" // "horizontal", "vertical", "vertical-menu"
  // Layout options
  formLayout="center medium" // Layout for form
  formTabTheme="steps" // Theme for form tabs
  viewMode="list" // "list", "table", "single"
  displayColumn="triple" // "single", "double", "triple" for card layouts
  // Messaging/notifications
  setMessage={(msg) => alert(msg)} // Function to display messages
  // Branding
  addLabel={{ label: "Create Event", icon: "add" }} // Custom add button text and icon
/>
```

## ListItems Specific Props (Multiple Records)

These props are applicable when using the component for listing multiple records:

```jsx
<ListTable
  // Column configuration
  attributes={[
    {
      name: "title", // Field name in the data
      label: "Event Name", // Display label
      type: "text", // Display type
      width: "25%", // Width of column
      sortable: true, // Enable sorting
      filterable: true, // Enable filtering
      searchable: true, // Include in search
      hideOnMobile: false, // Hide on mobile devices
      valueModifier: (value) => value.toUpperCase(), // Transform display value
    },
    { name: "startDate", label: "Start Date", type: "datetime" },
    { name: "location", label: "Location", type: "text" },
  ]}
  // List configuration
  rowLimit={10} // Items per page
  defaultSort={{ field: "createdAt", order: "desc" }} // Default sorting
  defaultFilter={{ isActive: true }} // Default filters
  allowCustomFilter={true} // Allow custom filters
  allowRangeFilter={true} // Allow date range filters
  allowSearch={true} // Show search field
  // Actions
  actions={[
    {
      key: "activate",
      icon: "check",
      label: "Activate",
      handler: (item) => console.log("Activate", item),
    },
  ]}
  // Dot menu actions
  dotMenu={[
    {
      key: "viewAttendees",
      label: "View Attendees",
      handler: (item) => console.log("View attendees", item),
    },
  ]}
  // Header actions
  headerActions={[
    {
      label: "Visit Website",
      icon: "share",
      onClick: (openData) => {
        window.open(`https://${openData.data.website}`, "_blank");
      },
    },
  ]}
  // Data refresh
  refreshInterval={60000} // Auto-refresh interval in ms
  // Layout
  cardView={false} // Card view instead of table
  gridColumns={3} // Number of columns in card view
  enableExport={true} // Allow export to Excel
  enablePrint={true} // Allow printing
  exportPrivilege={true} // User has export privilege
  // Statistics/Metrics display
  labels={[
    {
      key: "Live Events",
      title: "LIVE EVENTS",
      icon: "calendar-check",
      backgroundColor: "rgba(0, 200, 81, 0.15)",
      color: "#006B27",
    },
    {
      key: "Upcoming Events",
      title: "UPCOMING EVENTS",
      icon: "calendar-plus",
      backgroundColor: "rgba(0, 122, 255, 0.15)",
      color: "#004999",
    },
  ]}
  // Callbacks
  onDataLoaded={(data) => console.log("Data loaded", data)}
  onRowClick={(item) => console.log("Row clicked", item)}
/>
```

## ListItem Specific Props (Single Record)

These props are applicable when using the component for single record view/edit (`isSlug={true}`):

```jsx
<ListTable
  isSlug={true}
  // Record identification
  referenceId="649c0fee27d113dddba5491b" // ID of the record to load
  parentReference="_id" // Field to use as ID
  // Display
  showInfo={true} // Show info section
  showInfoType="open" // "open", "closed", "edit"
  // Parent-child relationships
  parents={{ franchise: "649c0fee27d113dddba5123" }} // Parent references
  // Form related
  formInput={myFormRef} // Reference to form
  // Custom item opening behavior
  itemOpenMode={{
    type: "open", // "open", "callback"
    callback: (data) => {
      setOpenItemData({ data });
      setOpenCustomModal(true);
    },
  }}
  // Sub-lists
  subLists={[
    {
      name: "attendees",
      api: "/api/v1/attendees",
      filter: { event: "{{_id}}" }, // {{_id}} will be replaced with item ID
      attributes: [
        { name: "fullName", label: "Name", type: "text" },
        { name: "email", label: "Email", type: "text" },
      ],
    },
  ]}
  // Header actions
  headerActions={[
    {
      key: "sendEmail",
      label: "Send Email",
      icon: "envelope",
      handler: (item) => console.log("Send email", item),
    },
  ]}
/>
```

## Advanced Features

### Bulk Upload

```jsx
<ListTable
  bulkUpload={true} // Enable bulk upload
  bulkUploadApi="/api/v1/events/bulk-upload" // API endpoint for bulk upload
  bulkUploadTemplate="event-template.xlsx" // Template file for bulk upload
/>
```

### Form Validation & Customization

```jsx
<ListTable
  onBeforeSubmit={(data) => {
    // Validate form data before submission
    if (!data.title) {
      return { valid: false, message: "Title is required" };
    }

    // Transform data if needed
    data.slug = data.title.toLowerCase().replace(/\s+/g, "-");

    return { valid: true, data };
  }}
  formLayout="center medium" // Control form layout
  formTabTheme="steps" // Theme for form tabs
/>
```

### Advanced Item Opening

```jsx
<ListTable
  itemOpenMode={{
    type: "callback",
    callback: (data) => {
      setOpenItemData({ data });
      setOpenCustomModal(true);
    },
  }}
/>
```

## Usage Examples

### Example 1: Event List with Filters, Custom Actions and Statistics

```jsx
<ListTable
  api="/api/v1/events/franchise"
  shortName="Event"
  pluralName="Events"
  icon="calendar"
  // Column configuration
  attributes={[
    { name: "title", label: "Event Name", type: "text", filterable: true, searchable: true },
    { name: "startDate", label: "Start Date", type: "datetime", sortable: true },
    { name: "endDate", label: "End Date", type: "datetime" },
    { name: "venue", label: "Venue", type: "text", filterable: true },
    {
      name: "isActive",
      label: "Status",
      type: "boolean",
      filterable: true,
      valueModifier: (value) => (value ? "Active" : "Inactive"),
      valueStyle: (value) => ({ color: value ? "green" : "red" }),
    },
  ]}
  // Default filtering and sorting
  defaultFilter={{ isActive: true }}
  defaultSort={{ field: "startDate", order: "desc" }}
  // Custom actions
  actions={[
    {
      key: "viewAttendees",
      icon: "users",
      label: "Attendees",
      handler: (item) => (window.location.href = `/events/${item._id}/attendees`),
    },
  ]}
  // Dot menu actions
  dotMenu={[
    {
      key: "duplicate",
      label: "Clone Event",
      handler: (item) => console.log("Clone", item),
    },
    {
      key: "export",
      label: "Export Data",
      handler: (item) => console.log("Export", item),
    },
  ]}
  // Display metrics cards
  labels={[
    {
      key: "Live Events",
      title: "LIVE EVENTS",
      icon: "calendar-check",
      backgroundColor: "rgba(0, 200, 81, 0.15)",
      color: "#006B27",
    },
    {
      key: "Upcoming Events",
      title: "UPCOMING EVENTS",
      icon: "calendar-plus",
      backgroundColor: "rgba(0, 122, 255, 0.15)",
      color: "#004999",
    },
    {
      key: "Past Events",
      title: "PAST EVENTS",
      icon: "calendar-minus",
      backgroundColor: "rgba(255, 69, 58, 0.15)",
      color: "#99231B",
    },
  ]}
  // Permissions
  createPrivilege={true}
  updatePrivilege={true}
  delPrivilege={true}
  // Form configuration
  formMode="popup"
  popupMode="large"
  // Search and pagination
  allowSearch={true}
  rowLimit={15}
  // Export options
  enableExport={true}
  enablePrint={true}
  // Callbacks
  setMessage={(msg) => toast(msg)}
  onRowClick={(item) => console.log("Row clicked", item)}
/>
```

### Example 2: Sessions List with SubList and Nested Actions

This example shows how to create a list of sessions with a nested sublist of session speakers:

```jsx
<ListTable
  api="sessions"
  parentReference="event"
  itemTitle={{ name: "title", type: "text", collection: "" }}
  bulkUpload={true}
  shortName="Sessions"
  itemOpenMode={{
    type: "callback",
    callback: (data) => {
      setOpenItemData({ data });
      setOpenMenuSetupAudio(true);
    },
  }}
  addPrivilege={true}
  delPrivilege={true}
  updatePrivilege={true}
  customClass="medium"
  viewMode="list"
  formMode="single"
  exportPrivilege={true}
  actions={[
    {
      element: "action",
      type: "subList",
      id: "session-speaker",
      title: "Add Sub Program",
      icon: "speakers",
      actionType: "button",
      attributes: sessionSpeaker,
      params: {
        api: `session-speaker`,
        parentReference: "session",
        itemTitle: { name: "title", type: "text", collection: "" },
        shortName: "Sub Program",
        addPrivilege: true,
        delPrivilege: true,
        updatePrivilege: true,
        customClass: "medium",
        viewMode: "table",
        formMode: "single",
      },
    },
    {
      element: "button",
      type: "callback",
      callback: (item, data) => {
        setOpenItemData({ item, data });
        setOpenMenuSetupAudio(true);
      },
      itemTitle: {
        name: "title",
        type: "text",
        collection: "",
      },
      icon: "upload",
      title: "Upload Audio",
      params: {
        api: ``,
        parentReference: "session",
        itemTitle: {
          name: "title",
          type: "text",
          collection: "",
        },
        shortName: "Audio",
        addPrivilege: true,
        delPrivilege: true,
        updatePrivilege: true,
        customClass: "full-page",
      },
    },
  ]}
/>
```

## Attribute Types

The `attributes` prop accepts various field types to control display and editing:

```jsx
attributes={[
  // Text and rich text
  { name: "title", label: "Title", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "content", label: "Content", type: "richtext" },

  // Date and time
  { name: "startDate", label: "Start Date", type: "datetime" },
  { name: "endDate", label: "End Date", type: "date" },
  { name: "startTime", label: "Start Time", type: "time" },

  // Boolean and state
  { name: "isActive", label: "Status", type: "boolean" },
  { name: "isPublished", label: "Published", type: "switch" },

  // Numbers and currency
  { name: "price", label: "Price", type: "currency" },
  { name: "quantity", label: "Quantity", type: "number" },
  { name: "rating", label: "Rating", type: "slider", min: 1, max: 5 },

  // Media
  { name: "image", label: "Image", type: "image" },
  { name: "file", label: "File", type: "file" },
  { name: "gallery", label: "Gallery", type: "gallery" },

  // Selection
  { name: "category", label: "Category", type: "select", options: [...] },
  { name: "tags", label: "Tags", type: "multiselect", options: [...] },

  // Complex types
  { name: "location", label: "Location", type: "map" },
  { name: "colorTheme", label: "Color", type: "color" },

  // Visual separation
  { type: "title", title: "SECTION TITLE", id: "section1" },
  { type: "divider" },

  // Custom rendering
  {
    name: "customField",
    label: "Custom",
    type: "custom",
    renderer: (value, item) => <CustomComponent value={value} item={item} />
  }
]}
```

## Event Handling

The list components provide multiple customization points for event handling:

```jsx
<ListTable
  // Row actions
  onRowClick={(item) => handleRowClick(item)}
  // Custom actions
  actions={[
    {
      key: "customAction",
      label: "Custom Action",
      icon: "star",
      handler: (item) => handleCustomAction(item),
      condition: (item) => item.status === "active", // Only show for active items
    },
  ]}
  // Form submissions
  onBeforeSubmit={(data) => {
    // Modify form data before submission
    return { ...data, lastUpdated: new Date() };
  }}
  onAfterSubmit={(response, formData) => {
    // Handle successful submission
    console.log("Submitted successfully", response);
  }}
  // Data loading
  onDataLoaded={(data) => {
    // Do something with the loaded data
    setTotalCount(data.length);
  }}
  // Value transformations
  onChange={(name, updateValue) => {
    // Transform values during form changes
    if (name === "startDate") {
      // Auto-adjust endDate to be after startDate
      const startTime = moment(updateValue["startDate"]);
      updateValue["endDate"] = moment(startTime).add(1, "hour").toISOString();
    }
    return updateValue;
  }}
/>
```

## Nested Elements and SubLists

The List component supports nested elements and sublists, which is particularly useful for managing related data:

### Tab Groups

```jsx
<ListTable
  actions={[
    {
      element: "button",
      type: "subTabs",
      id: "attendance",
      title: "Attendance",
      icon: "attendance",
      tabs: [
        {
          element: "button",
          type: "subList",
          id: "attendance-all",
          title: "All",
          icon: "all",
          attributes: attendanceData,
          params: {
            api: `attendance/all`,
            parentReference: "event",
            itemTitle: { name: "title", type: "text", collection: "" },
            actions: attendanceActions,
            shortName: "All List",
            exportPrivilege: true,
            viewMode: "table",
          },
        },
        {
          element: "button",
          type: "subList",
          id: "attendance-check-in",
          title: "Check-In List",
          icon: "accessed",
          attributes: attendanceData,
          params: {
            api: `attendance/check-in`,
            parentReference: "event",
            itemTitle: { name: "title", type: "text", collection: "" },
            shortName: "Check-In List",
            exportPrivilege: true,
            viewMode: "table",
          },
        },
      ],
    },
  ]}
/>
```

### SubLists with Parent References

```jsx
<ListTable
  actions={[
    {
      element: "button",
      type: "subList",
      id: "speakers",
      title: "Speakers",
      icon: "speakers",
      attributes: speakerAttributes,
      params: {
        api: `speakers`,
        parentReference: "event",
        itemTitle: { name: "name", type: "text", collection: "" },
        shortName: "Speakers",
        addPrivilege: true,
        delPrivilege: true,
        updatePrivilege: true,
        customClass: "medium",
        viewMode: "grid",
        formMode: "single",
      },
    },
  ]}
/>
```

### Custom Page Navigation

```jsx
<ListTable
  actions={[
    {
      element: "button",
      type: "custom",
      id: "recap-user",
      icon: "attendees",
      title: "Attendee",
      page: "recapUser",
    },
  ]}
/>
```

### Section Headers

```jsx
<ListTable
  actions={[
    {
      type: "title",
      title: "SETTINGS",
      id: "SETTINGS",
    },
    {
      element: "button",
      type: "subList",
      id: "instarecap-setting",
      title: "InstaRecap Settings",
      icon: "display",
      // ...
    },
  ]}
/>
```

This documentation covers the primary usage patterns for the ListTable component system. The components are highly configurable, supporting various display options, data operations, and custom actions to fit different application needs.
