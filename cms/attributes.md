# EventHex Attributes Documentation

This documentation provides a comprehensive reference for configuring attributes in the EventHex application. Attributes define the structure and behavior of form fields, filters, and display elements throughout the system.

## Table of Contents

1. [Attribute Structure](#attribute-structure)
2. [Common Properties](#common-properties)
3. [Attribute Types](#attribute-types)
4. [Filtering Options](#filtering-options)
5. [Conditional Rendering](#conditional-rendering)
6. [Validation](#validation)
7. [Layout & Styling](#layout--styling)
8. [Advanced Features](#advanced-features)
9. [Examples](#examples)

## Attribute Structure

An attribute is defined as a JavaScript object with properties that control its appearance, behavior, and data handling:

```javascript
{
  type: "text",               // The attribute type
  name: "title",              // Field name (matches database field)
  label: "Event Title",       // Display label
  // Additional properties based on requirements
}
```

## Common Properties

These properties are applicable to most attribute types:

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `type` | string | Defines the attribute type | `"text"`, `"select"`, `"datetime"` |
| `name` | string | Field name in the database | `"title"`, `"startDate"` |
| `label` | string | Display label | `"Event Title"` |
| `placeholder` | string | Placeholder text | `"Enter event title"` |
| `default` | any | Default value | `""`, `"today"`, `true` |
| `validation` | string | Validation rules | `"required"`, `"email"` |
| `required` | boolean | Whether the field is required | `true`, `false` |
| `view` | boolean | Whether to display in view mode | `true`, `false` |
| `add` | boolean | Whether to display when adding | `true`, `false` |
| `update` | boolean | Whether to display when updating | `true`, `false` |
| `tag` | boolean | Whether to use as a tag in listings | `true`, `false` |
| `customClass` | string | CSS class or layout hint | `"full"`, `"half"`, `"quarter"` |
| `icon` | string | Icon to display | `"date"`, `"location"` |
| `footnote` | string | Help text shown below the field | `"For best results, use a transparent background"` |
| `group` | string | Groups the field under a section | `"Event Details"`, `"Registration"` |
| `onChange` | function | Function to call when value changes | `onEventChange` |
| `hide` | boolean | Whether to hide field completely | `true`, `false` |

## Attribute Types

### Basic Types

#### Text Input
```javascript
{
  type: "text",
  name: "title",
  label: "Event Name",
  placeholder: "Enter Event Title",
  required: true,
  customClass: "full"
}
```

#### Number Input
```javascript
{
  type: "number",
  name: "price",
  label: "Price",
  placeholder: "Enter price",
  default: 0
}
```

#### Password Input
```javascript
{
  type: "password",
  name: "password",
  label: "Password",
  placeholder: "Enter password"
}
```

#### Textarea
```javascript
{
  type: "textarea",
  name: "description",
  label: "Description",
  placeholder: "Enter description"
}
```

#### Rich Text Editor
```javascript
{
  type: "htmleditor",
  name: "description",
  label: "About Your Event",
  placeholder: "Give attendees an overview of your event"
}
```

#### Checkbox
```javascript
{
  type: "checkbox",
  name: "multiEvent",
  label: "Is this a multi day event?",
  default: false
}
```

#### Toggle/Switch
```javascript
{
  type: "toggle",
  name: "enableSocialMedia",
  label: "Enable Social Media?",
  default: false
}
```

#### Hidden Field
```javascript
{
  type: "hidden",
  name: "type",
  default: "Form"
}
```

### Date & Time Types

#### Date Picker
```javascript
{
  type: "date",
  name: "startDate",
  label: "Start Date",
  default: "today",
  minDate: "today",
  icon: "date"
}
```

#### Time Picker
```javascript
{
  type: "time",
  name: "startTime",
  label: "Start Time",
  icon: "time"
}
```

#### Date and Time Picker
```javascript
{
  type: "datetime",
  name: "startDate",
  label: "Start Date & Time",
  default: "today",
  minDate: "today",
  split: true
}
```

### Selection Types

#### Single Select (Dropdown)
```javascript
{
  type: "select",
  name: "eventType",
  label: "Event Type",
  apiType: "JSON",
  selectApi: [
    { value: "In-person", id: "in-person", description: "Host a physical event" },
    { value: "Virtual", id: "virtual", description: "Host an online event" }
  ]
}
```

#### Single Select with API Data
```javascript
{
  type: "select",
  name: "franchise",
  label: "Creating Event for",
  apiType: "API",
  selectApi: "franchise/select",
  showItem: "name"
}
```

#### Multi-select
```javascript
{
  type: "multiSelect",
  name: "mobileModules",
  label: "Mobile Modules",
  apiType: "JSON",
  selectType: "card",
  selectApi: [
    { value: "InstaSnap", id: "InstaSnap" },
    { value: "Networking", id: "Networking" }
  ]
}
```

#### Multi-select with API Data
```javascript
{
  type: "multiSelect",
  name: "countries",
  label: "Countries",
  apiType: "API",
  selectApi: "country/select",
  showItem: "title"
}
```

### Media Types

#### Image Upload
```javascript
{
  type: "image",
  name: "logo",
  label: "Event Logo",
  footnote: "For best results, use a transparent background"
}
```

#### File Upload
```javascript
{
  type: "file",
  name: "document",
  label: "Document",
  accept: ".pdf,.doc,.docx"
}
```

### Layout Elements

#### Section Title
```javascript
{
  type: "title",
  title: "Event Details",
  name: "Event Details",
  icon: "configuration",
  add: true,
  update: true
}
```

#### Divider Line
```javascript
{
  type: "line",
  add: true,
  update: true
}
```

### Visual & UI Elements

#### Color Picker
```javascript
{
  type: "color",
  name: "themeColor",
  label: "Theme Color",
  default: "#022753"
}
```

## Filtering Options

Attributes can be configured for filtering in list views:

### Basic Filter
```javascript
{
  type: "text",
  name: "title",
  label: "Event Name",
  filter: true
}
```

### Filter with Position
```javascript
{
  type: "select",
  name: "availability",
  label: "Availability",
  filter: true,
  filterPosition: "right",  // "left", "right", "top"
  filterType: "tabs",       // "tabs", "dropdown", "checkbox"
  apiType: "JSON",
  selectApi: [
    { value: "All", id: "" },
    { value: "Live", id: "Live" },
    { value: "Upcoming", id: "Upcoming" },
    { value: "Past", id: "Past" }
  ]
}
```

### Advanced Filter Options
```javascript
{
  type: "multiSelect",
  name: "countries",
  label: "Countries",
  apiType: "API",
  selectApi: "country/select",
  filter: true,
  filterSearchable: true,  // Enable search in filter dropdown
  filterMultiple: true     // Allow multiple selections in filter
}
```

## Conditional Rendering

You can control when an attribute is visible or enabled based on other fields:

### Simple Condition
```javascript
{
  type: "number",
  name: "discountValue",
  label: "Offer Price",
  condition: {
    item: "enableDiscount",  // Field to check
    if: true,                // Value to compare
    then: "enabled",         // Action if condition is met
    else: "disabled"         // Action if condition is not met
  }
}
```

### Multiple Conditions
```javascript
{
  type: "datetime",
  name: "endDate",
  label: "End Date & Time",
  condition: {
    item: "multiEvent",
    if: true,
    then: "enabled",
    else: "disabled"
  }
}
```

Available actions:
- `"enabled"`: Field is enabled and visible
- `"disabled"`: Field is disabled but visible
- `"visible"`: Field is visible (readonly)
- `"hidden"`: Field is hidden

## Validation

### Basic Validation
```javascript
{
  type: "text",
  name: "email",
  label: "Email",
  validation: "email",
  required: true
}
```

### Custom Validation
```javascript
{
  type: "text",
  name: "slug",
  label: "Slug",
  validate: "slug",
  required: true
}
```

## Layout & Styling

Control the layout and appearance of attributes:

### Width Classes
```javascript
{
  type: "text",
  name: "title",
  label: "Event Name",
  customClass: "full"    // "full", "half", "quarter", "third"
}
```

### Icons
```javascript
{
  type: "datetime",
  name: "startDate",
  label: "Start Date",
  icon: "date"           // Icon name
}
```

### Help Text
```javascript
{
  type: "image",
  name: "logo",
  label: "Event Logo",
  footnote: "For best results, use a transparent background",
  footnoteIcon: "info"   // Optional icon for footnote
}
```

### Grouping
```javascript
{
  type: "text",
  name: "title",
  label: "Event Name",
  group: "Event Details"  // Group name for organization
}
```

## Advanced Features

### Status Labels
```javascript
{
  type: "text",
  name: "title",
  label: "Form Name",
  statusLabel: {
    nextLine: true,
    size: "small",
    conditions: [
      {
        when: "status",
        condition: "EQUALS",
        compare: "Closed",
        type: "string",
        label: "Sale Closed",
        icon: "close",
        color: "beige"
      }
    ]
  }
}
```

### Dependent Dropdown with Add New Option
```javascript
{
  type: "select",
  name: "category",
  label: "Exhibitor Category",
  apiType: "API",
  selectApi: "exhibitor-category/select",
  addNew: {
    attributes: [
      {
        type: "text",
        name: "categoryName",
        label: "Add an exhibitor category",
        required: true
      }
    ],
    api: "exhibitor-category"
  }
}
```

### Selective Display
```javascript
{
  type: "text",
  name: "title",
  label: "Event Name",
  view: true,    // Show in view mode
  add: true,     // Show in add mode
  update: true,  // Show in update mode
  filter: true   // Enable in filters
}
```

### Auto-applying Changes
```javascript
{
  type: "datetime",
  name: "startDate",
  label: "Start Date",
  onChange: onEventChange  // Function that transforms values
}
```

## Examples

### Event Registration Form

```javascript
const attributes = [
  {
    type: "title",
    title: "Basic Configurations",
    name: "Basic Configurations",
    icon: "configuration",
    add: true,
    update: true,
    info: "Configure the basic details of your event"
  },
  {
    type: "text",
    name: "title",
    label: "Event Name",
    placeholder: "Enter Event Title",
    required: true,
    view: true,
    add: true,
    update: true,
    customClass: "full"
  },
  {
    type: "select",
    name: "eventType",
    label: "Event Type",
    apiType: "JSON",
    selectType: "card",
    selectApi: [
      {
        value: "In-person",
        id: "in-person",
        description: "Host a physical event for direct networking.",
        icon: "in-person"
      },
      {
        value: "Virtual",
        id: "virtual",
        description: "Host an online event that connects remote participants.",
        icon: "virtual"
      }
    ],
    required: true,
    customClass: "full"
  },
  {
    type: "checkbox",
    name: "multiEvent",
    label: "Is this a multi day event?",
    onChange: onEventChange,
    default: false,
    customClass: "full"
  },
  {
    type: "datetime",
    name: "startDate",
    label: "Start Date & Time",
    onChange: onEventChange,
    default: "today",
    minDate: "today",
    required: true,
    view: true,
    add: true,
    update: true,
    icon: "date",
    customClass: "half"
  },
  {
    type: "datetime",
    name: "endDate",
    label: "End Date & Time",
    onChange: onEventChange,
    condition: {
      item: "multiEvent",
      if: true,
      then: "enabled",
      else: "disabled"
    },
    required: true,
    customClass: "half"
  }
];
```

### Filter Configuration

```javascript
const filterAttributes = [
  {
    type: "select",
    name: "availability",
    label: "Availability",
    apiType: "JSON",
    filter: true,
    filterPosition: "right",
    filterType: "tabs",
    selectApi: [
      { value: "All", id: "" },
      { value: "Live", id: "Live" },
      { value: "Upcoming", id: "Upcoming" },
      { value: "Past", id: "Past" }
    ]
  },
  {
    type: "select",
    name: "eventType",
    label: "Event Type",
    apiType: "JSON",
    filter: true,
    filterPosition: "left",
    filterType: "dropdown",
    selectApi: [
      { value: "All", id: "" },
      { value: "In-person", id: "in-person" },
      { value: "Virtual", id: "virtual" }
    ]
  },
  {
    type: "text",
    name: "title",
    label: "Event Name",
    placeholder: "Search events...",
    filter: true,
    filterPosition: "top",
    filterType: "search"
  }
];
```

This documentation covers the key aspects of the attributes system in the EventHex application, providing guidance on creating and configuring different types of fields for forms, filters, and displays.

General Structure

Each attribute in your attributes array will be a JavaScript object with a consistent structure. Here's the fundamental layout:

{
  type: "attributeType", // Required: String indicating the attribute's type (e.g., "text", "select", "image").
  name: "fieldName",      // Required: String representing the name of the field in the data object.
  label: "Display Label", // Required: String for the user-friendly label displayed in the UI.

  // --- Optional properties, but commonly used ---
  placeholder: "Input Hint", // String: Placeholder text for input fields.
  validation: "",           // String: Validation rules (e.g., "required", "email", "number"). You'll need to implement your validation logic.
  default: "",              // Default value for the attribute.  Be mindful of data types!
  required: false,         // Boolean: Whether the attribute is mandatory.
  view: true,              // Boolean: Whether the attribute should be displayed in a "view" mode (e.g., read-only display).
  add: true,               // Boolean: Whether the attribute is editable when creating a new record.
  update: true,            // Boolean: Whether the attribute is editable when updating an existing record.
  customClass: "",         // String: CSS class to apply for custom styling.
  footnote: "",            // String: Additional information or explanation for the attribute.
  footnoteIcon: "",         // String: Icon to display next to the footnote.

  // --- More specialized properties ---
  condition: {             // Conditional rendering of this attribute based on another attribute.
    item: "otherFieldName",
    if: "expectedValue",   // Be sure this matches the datatype of the item
    then: "enabled",      // or "visible", "hidden", "disabled", "required"
    else: "disabled"
  },
  apiType: "API",          // or "JSON", "CSV": Indicates how the data for the attribute is fetched (e.g., from an API endpoint, a JSON object, a CSV string).
  selectApi: "",           // or array: API endpoint or array of objects for select options.
  selectType: "card",      // Type of display for select options (e.g., "card", "dropdown", "radio").
  showItem: "",            // Field in the API response to display in select options.
  split: false,            // Boolean: If the attribute is split into multiple columns (e.g., for datetime).
  tag: false,              // Boolean:  Used for specific UI styling/features (often related to pills/tags).
  addNew: {              // Configuration for adding a new related item (e.g., adding a new category).
    attributes: [],    // Array of attribute objects for the new item's form.
    api: "",            // API endpoint for creating the new item.
  },
  editable: true,          //Boolean: If the attribute can be editable

  // --- Specific to certain attribute types ---
  image: {                // Configuration for image attributes.
      field: "profilePic", // Field name in the data object for the image URL.
      collection: "users"   //Collection of the image from data Object
  },
  description: {        // Configuration to dynamically display the description for the list
      type: "text",
      field: "address",
      collection: "users"
  },

  // --- More UI properties
  icon: "",              // String: Icon to display next to the label.
  filter: true,          // Boolean: If this attribute should be used in the filter.
  filterType: "tabs",    // or "dropdown", "range", etc.
  filterPosition: "right",  // or "left"
  filterDefault: "",      // Default value for the filter.
  sort: true,            // Boolean: If the attribute can be sorted.
}


Attribute Type Breakdown with Examples and Inline Docs

text: A single-line text input field.

{
  type: "text",
  name: "eventName",
  label: "Event Name",
  placeholder: "Enter event name",
  validation: "required|max:255", //Example of Laravel Validation Rule.
  default: "",
  required: true,
  view: true,
  add: true,
  update: true,
  customClass: "full",
  footnote: "This is the name of your event as it will be displayed to attendees.",
  footnoteIcon: "info",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

textarea: A multi-line text input field.

{
  type: "textarea",
  name: "description",
  label: "Description",
  placeholder: "Enter a description of the event",
  validation: "max:1000",
  default: "",
  required: false,
  view: true,
  add: true,
  update: true,
  customClass: "full",
  footnote: "Provide a detailed description of the event to inform potential attendees.",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

number: A numeric input field.

{
  type: "number",
  name: "capacity",
  label: "Capacity",
  placeholder: "Enter event capacity",
  validation: "required|integer|min:1",
  default: 100,
  required: true,
  view: true,
  add: true,
  update: true,
  customClass: "half",
  icon: "user",
  footnote: "The maximum number of attendees allowed at the event.",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

select: A dropdown select field.

{
  type: "select",
  name: "eventCategory",
  label: "Event Category",
  placeholder: "Select category",
  apiType: "API",
  selectApi: "event-categories",
  showItem: "name",
  validation: "required",
  default: "",
  required: true,
  view: true,
  add: true,
  update: true,
  customClass: "full",
  footnote: "Select the category that best describes the event.",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

apiType: "API": Fetches select options from an API endpoint specified in selectApi. The API response should be an array of objects, and showItem indicates which field to display for each option.

apiType: "JSON": The selectApi property is an array of objects that provides the select options:

selectApi: [
  { value: "In-person", id: "in-person" },
  { value: "Virtual", id: "virtual" },
]
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

apiType: "CSV": selectApi is a comma-separated string:

selectApi: "Open,Closed,Sold Out"
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

multiSelect: Allows selecting multiple options from a list.

{
  type: "multiSelect",
  name: "tags",
  label: "Tags",
  placeholder: "Select event tags",
  apiType: "API",
  selectApi: "tags",
  showItem: "name",
  default: [],
  required: false,
  view: true,
  add: true,
  update: true,
  customClass: "full",
  footnote: "Select relevant tags to categorize your event.",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

datetime: For date and time input.

{
  type: "datetime",
  name: "startDate",
  label: "Start Date & Time",
  placeholder: "Select start date and time",
  validation: "required",
  default: "now",
  required: true,
  view: true,
  add: true,
  update: true,
  customClass: "half",
  icon: "calendar",
  footnote: "The date and time when the event begins.",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

date: For only date input.

{
  type: "date",
  name: "endDate",
  label: "End Date & Time",
  placeholder: "Select end date and time",
  validation: "required",
  default: "now",
  required: true,
  view: true,
  add: true,
  update: true,
  customClass: "half",
  icon: "calendar",
  footnote: "The date and time when the event ends.",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

time: For only time input.

{
  type: "time",
  name: "time",
  label: "End Time",
  placeholder: "Select end time",
  validation: "required",
  default: "now",
  required: true,
  view: true,
  add: true,
  update: true,
  customClass: "half",
  icon: "time",
  footnote: "The time when the event ends.",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

checkbox: A boolean check box.

{
  type: "checkbox",
  name: "isFree",
  label: "Is Free",
  default: false,
  required: false,
  view: true,
  add: true,
  update: true,
  customClass: "full",
  footnote: "Check if the event is free to attend.",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

toggle: A switch for boolean values.

{
  type: "toggle",
  name: "isPublished",
  label: "Publish Event",
  default: false,
  required: false,
  view: true,
  add: true,
  update: true,
  customClass: "full",
  footnote: "Toggle to publish or unpublish the event.",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

image: For uploading/selecting images.

{
  type: "image",
  name: "eventPoster",
  label: "Event Poster",
  placeholder: "Upload event poster",
  validation: "required",
  default: "",
  required: true,
  view: true,
  add: true,
  update: true,
  customClass: "full",
  footnote: "Upload an image to be used as the event poster.",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

line: For line divisions.

{
  type: "line",
  add: true,
  update: true,
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

htmleditor: For rich text editor.

{
  type: "htmleditor",
  placeholder: "About Your Event",
  // placeholder: "Give attendees an overview of your event—what to expect, who should attend, and any special highlights",
  name: "description",
  validation: "",
  default: "",
  label: "About Your Event",
  tag: false,
  required: false,
  view: false,
  add: false,
  update: true,
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

mobilenumber: A single-line text input field only for phone number input.

{
  type: "mobilenumber",
  placeholder: "Phone Number",
  name: "authenticationId",
  validation: "",
  default: "",
  tag: true,
  label: "Phone Number",
  required: true,
  view: true,
  add: false,
  update: false,
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

email: A single-line text input field for only email.

{
  type: "email",
  placeholder: "Email ID",
  name: "emailId",
  validation: "",
  default: "",
  tag: true,
  label: "Email ID",
  required: true,
  view: true,
  add: false,
  update: false,
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

title: For titles divisions.

{
  type: "title",
  title: "Social Media Configuration",
  name: "sm",
  add: true,
  update: true,
  info: "Add speaker's social media profiles for attendees to connect",
}
IGNORE_WHEN_COPYING_START
content_copy
download
Use code with caution.
JavaScript
IGNORE_WHEN_COPYING_END

Important Notes on Implementation

Validation: Your validation strings are placeholders. You'll need to integrate these with a validation library (e.g., Formik, Yup, react-hook-form) or implement your own validation logic.

API Integration: When apiType: "API", you'll need to use useEffect or similar mechanisms to fetch the select options from the API and store them in local state.

Conditional Rendering: The condition property requires careful handling in your UI component to enable/disable or show/hide attributes based on the value of the item attribute.

Hidden: It will hide the attribute fields.

Best Practices

Componentization: Create reusable UI components for each attribute type (e.g., a TextInput, SelectInput, ImageUpload component). This will keep your code clean and maintainable.

Centralized State Management: Consider using Redux, Context API, or similar for managing the data associated with these attributes, especially if the data needs to be shared across multiple components.

Accessibility: Ensure your form elements are accessible (e.g., use appropriate ARIA attributes, provide labels for all inputs).

Typescript (Recommended): Use Typescript to define interfaces for your attribute objects and the data they represent. This will help catch errors early and improve code readability.

Default values: Use null for default values.

By following this structure, you can create a flexible and well-documented system for managing form attributes in your React application.