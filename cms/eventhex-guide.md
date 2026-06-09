# EventHex Development Guide: Creating Pages with List Component and Attributes

This comprehensive guide explains how to create pages in EventHex using the List component and attributes system. It provides practical examples and best practices for building robust, feature-rich interfaces.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Basic Page Creation](#basic-page-creation)
3. [Common Patterns](#common-patterns)
4. [Advanced Configurations](#advanced-configurations)
5. [Complete Examples](#complete-examples)

## Quick Start

Here's a minimal example to get started with creating a page:

```jsx
import ListTable from "../components/core/list/list";

const EventsPage = () => {
  const attributes = [
    {
      type: "text",
      name: "title",
      label: "Event Name",
      required: true,
      customClass: "full"
    },
    {
      type: "datetime",
      name: "startDate",
      label: "Start Date & Time",
      required: true,
      customClass: "half"
    },
    {
      type: "select",
      name: "eventType",
      label: "Event Type",
      apiType: "JSON",
      selectApi: [
        { value: "In-person", id: "in-person" },
        { value: "Virtual", id: "virtual" }
      ],
      required: true
    }
  ];

  return (
    <ListTable 
      api="/api/v1/events"
      shortName="Event"
      attributes={attributes}
      formMode="popup"
      createPrivilege={true}
      updatePrivilege={true}
      delPrivilege={true}
    />
  );
};

export default EventsPage;
```

## Basic Page Creation

### 1. Define Your Attributes

Attributes define the fields and their behavior in your forms and lists:

```javascript
const attributes = [
  // Basic Information Section
  {
    type: "title",
    title: "Basic Information",
    name: "basicInfo",
    icon: "info"
  },
  {
    type: "text",
    name: "title",
    label: "Title",
    required: true,
    placeholder: "Enter title",
    customClass: "full",
    validation: "required",
    filter: true,
    searchable: true
  },
  {
    type: "select",
    name: "status",
    label: "Status",
    apiType: "JSON",
    selectApi: [
      { value: "Active", id: "active" },
      { value: "Draft", id: "draft" }
    ],
    filter: true,
    filterPosition: "right",
    filterType: "tabs"
  }
];
```

### 2. Configure List Component

Set up your List component with the necessary configurations:

```jsx
<ListTable
  // Basic Configuration
  api="/api/v1/your-endpoint"
  shortName="Item"
  pluralName="Items"
  attributes={attributes}
  
  // Display Settings
  formMode="popup"
  popupMode="medium"
  viewMode="list"
  
  // Permissions
  createPrivilege={true}
  updatePrivilege={true}
  delPrivilege={true}
  
  // Optional Features
  enableExport={true}
  allowSearch={true}
  bulkUpload={true}
/>
```

## Common Patterns

### 1. Form with Sections

```javascript
const attributes = [
  // Basic Details Section
  {
    type: "title",
    title: "Basic Details",
    icon: "info"
  },
  {
    type: "text",
    name: "title",
    label: "Title",
    required: true
  },
  
  // Configuration Section
  {
    type: "title",
    title: "Configuration",
    icon: "settings"
  },
  {
    type: "select",
    name: "type",
    label: "Type",
    apiType: "JSON",
    selectApi: [/* options */]
  },
  
  // Media Section
  {
    type: "title",
    title: "Media",
    icon: "image"
  },
  {
    type: "image",
    name: "thumbnail",
    label: "Thumbnail",
    accept: "image/*"
  }
];
```

### 2. Filterable List

```javascript
const attributes = [
  {
    type: "text",
    name: "title",
    label: "Title",
    filter: true,
    filterPosition: "top",
    filterType: "search"
  },
  {
    type: "select",
    name: "status",
    label: "Status",
    filter: true,
    filterPosition: "right",
    filterType: "tabs",
    apiType: "JSON",
    selectApi: [
      { value: "All", id: "" },
      { value: "Active", id: "active" },
      { value: "Inactive", id: "inactive" }
    ]
  }
];
```

### 3. Conditional Fields

```javascript
const attributes = [
  {
    type: "checkbox",
    name: "hasDiscount",
    label: "Enable Discount"
  },
  {
    type: "number",
    name: "discountValue",
    label: "Discount Value",
    condition: {
      item: "hasDiscount",
      if: true,
      then: "enabled",
      else: "disabled"
    }
  }
];
```

## Advanced Configurations

### 1. Custom Actions

```javascript
<ListTable
  actions={[
    {
      key: "viewDetails",
      icon: "eye",
      label: "View Details",
      handler: (item) => handleViewDetails(item)
    }
  ]}
  dotMenu={[
    {
      key: "export",
      label: "Export Data",
      handler: (item) => handleExport(item)
    }
  ]}
/>
```

### 2. SubLists

```javascript
<ListTable
  subLists={[
    {
      name: "attendees",
      api: "/api/v1/attendees",
      filter: { event: "{{_id}}" },
      attributes: [
        { name: "name", label: "Name", type: "text" },
        { name: "email", label: "Email", type: "text" }
      ]
    }
  ]}
/>
```

### 3. Advanced Filtering

```javascript
const attributes = [
  {
    type: "select",
    name: "status",
    label: "Status",
    filter: true,
    filterPosition: "right",
    filterType: "tabs",
    filterSearchable: true,
    filterMultiple: true,
    apiType: "JSON",
    selectApi: [/* options */]
  }
];

<ListTable
  defaultFilter={{ isActive: true }}
  allowCustomFilter={true}
  allowRangeFilter={true}
  attributes={attributes}
/>
```

## Complete Examples

### 1. Event Management Page

```jsx
const EventsPage = () => {
  const attributes = [
    // Basic Information
    {
      type: "title",
      title: "Event Details",
      icon: "info"
    },
    {
      type: "text",
      name: "title",
      label: "Event Name",
      required: true,
      customClass: "full",
      filter: true,
      searchable: true
    },
    {
      type: "select",
      name: "eventType",
      label: "Event Type",
      apiType: "JSON",
      selectApi: [
        { value: "In-person", id: "in-person" },
        { value: "Virtual", id: "virtual" }
      ],
      required: true,
      filter: true,
      filterPosition: "left"
    },
    
    // Date & Time
    {
      type: "title",
      title: "Date & Time",
      icon: "calendar"
    },
    {
      type: "checkbox",
      name: "multiDay",
      label: "Multi-day Event",
      onChange: "onEventChange"
    },
    {
      type: "datetime",
      name: "startDate",
      label: "Start Date & Time",
      required: true,
      customClass: "half"
    },
    {
      type: "datetime",
      name: "endDate",
      label: "End Date & Time",
      required: true,
      customClass: "half",
      condition: {
        item: "multiDay",
        if: true,
        then: "enabled",
        else: "disabled"
      }
    },
    
    // Location
    {
      type: "title",
      title: "Location",
      icon: "map-pin"
    },
    {
      type: "text",
      name: "venue",
      label: "Venue",
      required: true,
      condition: {
        item: "eventType",
        if: "in-person",
        then: "enabled",
        else: "disabled"
      }
    },
    
    // Registration
    {
      type: "title",
      title: "Registration",
      icon: "user-plus"
    },
    {
      type: "select",
      name: "registrationType",
      label: "Registration Type",
      apiType: "JSON",
      selectApi: [
        { value: "Free", id: "free" },
        { value: "Paid", id: "paid" }
      ],
      required: true
    }
  ];

  return (
    <ListTable
      // Basic Configuration
      api="/api/v1/events"
      shortName="Event"
      pluralName="Events"
      attributes={attributes}
      
      // Display Settings
      formMode="popup"
      popupMode="large"
      viewMode="list"
      
      // Permissions
      createPrivilege={true}
      updatePrivilege={true}
      delPrivilege={true}
      
      // Features
      enableExport={true}
      allowSearch={true}
      bulkUpload={true}
      
      // Default Settings
      defaultSort={{ field: "startDate", order: "desc" }}
      defaultFilter={{ isActive: true }}
      
      // Statistics
      labels={[
        {
          key: "Live Events",
          title: "LIVE EVENTS",
          icon: "calendar-check",
          backgroundColor: "rgba(0, 200, 81, 0.15)",
          color: "#006B27"
        },
        {
          key: "Upcoming Events",
          title: "UPCOMING EVENTS",
          icon: "calendar-plus",
          backgroundColor: "rgba(0, 122, 255, 0.15)",
          color: "#004999"
        }
      ]}
      
      // Actions
      actions={[
        {
          key: "viewAttendees",
          icon: "users",
          label: "View Attendees",
          handler: (item) => handleViewAttendees(item)
        }
      ]}
      
      // Callbacks
      onBeforeSubmit={(data) => validateEventData(data)}
      onAfterSubmit={(response) => handleEventCreated(response)}
    />
  );
};

export default EventsPage;
```

This guide provides a comprehensive overview of creating pages using the EventHex List component and attributes system. For more specific use cases or advanced configurations, refer to the individual component and attribute documentation. 