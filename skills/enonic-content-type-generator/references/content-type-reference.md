# Enonic XP Content Type Reference

## XML Structure

Content types are XML files located at:
`/src/main/resources/site/content-types/[name]/[name].xml`

The directory name **must** match the file name (minus the `.xml` extension).

### Root Element

```xml
<content-type>
  <display-name>Human-Readable Name</display-name>
  <display-name-label>Override placeholder</display-name-label>   <!-- optional -->
  <description>Short description</description>                     <!-- optional -->
  <super-type>base:structured</super-type>                         <!-- required -->
  <is-abstract>false</is-abstract>                                 <!-- optional, default false -->
  <is-final>true</is-final>                                        <!-- optional, default false -->
  <is-built-in>false</is-built-in>                                 <!-- optional, default false -->
  <allow-child-content>true</allow-child-content>                  <!-- optional, default true -->
  <allow-child-content-type>base:folder</allow-child-content-type> <!-- optional, repeatable -->
  <form>
    <!-- inputs, item-sets, option-sets, field-sets, mixin refs -->
  </form>
</content-type>
```

### XSD Validation Attributes

Add these attributes to `<content-type>` for editor validation:

```xml
<content-type
    xmlns="urn:enonic:xp:model:1.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="urn:enonic:xp:model:1.0 https://raw.githubusercontent.com/enonic/xp/master/modules/core/core-api/src/main/resources/META-INF/xsd/model.xsd">
```

## Super-Types

| Super-Type | Purpose |
|---|---|
| `base:structured` | Default for custom content types with a form |
| `base:folder` | Container with no custom fields |
| `base:unstructured` | Schema-less, API-only content |
| `base:shortcut` | Redirect to another content item |
| `base:media` | Abstract base for uploaded files |

Always use `base:structured` unless the content type has a specific reason to inherit from another.

## Input Types Catalog

### Text Inputs

| Type | Value Type | Description |
|---|---|---|
| `TextLine` | String | Single-line text |
| `TextArea` | String | Multi-line plain text |
| `HtmlArea` | String | Rich-text editor (HTML) |

#### TextLine Config

```xml
<input name="socialsecuritynumber" type="TextLine">
  <label>My SSN</label>
  <config>
    <max-length>11</max-length>
    <show-counter>true</show-counter>
    <regexp>\b\d{3}-\d{2}-\d{4}\b</regexp>
  </config>
</input>
```

- `max-length` — maximum allowed characters (default: unlimited)
- `show-counter` — show text length counter (default: hidden)
- `regexp` — regular expression for validation

#### TextArea Config

```xml
<input name="mytextarea" type="TextArea">
  <label>My TextArea</label>
  <config>
    <max-length>500</max-length>
    <show-counter>true</show-counter>
  </config>
</input>
```

- `max-length` — maximum allowed characters (default: unlimited)
- `show-counter` — show text length counter (default: hidden)

#### HtmlArea Config

```xml
<input name="myhtmlarea" type="HtmlArea">
  <label>My HtmlArea</label>
  <config>
    <exclude>*</exclude>
    <include>JustifyLeft JustifyRight | Bold Italic</include>
    <allowHeadings>h2 h4 h6</allowHeadings>
  </config>
</input>
```

- `exclude` — remove tools from toolbar (use `*` to remove all)
- `include` — add tools to toolbar (separate with space, group with `|`)
- `allowHeadings` — space-separated list of allowed heading tags (`h1` through `h6`; all allowed by default)

Default toolbar: `Format | JustifyBlock JustifyLeft JustifyCenter JustifyRight | BulletedList NumberedList Outdent Indent | FindAndReplace SpecialChar Anchor Image Macro Link Unlink | Table | PasteModeSwitcher`

### Numeric Inputs

| Type | Value Type | Description |
|---|---|---|
| `Long` | Long | Integer number |
| `Double` | Double | Decimal number |

#### Long Config

```xml
<input name="degrees" type="Long">
  <label>Degrees</label>
  <config>
    <min>0</min>
    <max>360</max>
  </config>
</input>
```

- `min` — minimum allowed value
- `max` — maximum allowed value

#### Double Config

```xml
<input name="angle" type="Double">
  <label>Angle (rad)</label>
  <config>
    <min>0</min>
    <max>3.14159</max>
  </config>
</input>
```

- `min` — minimum allowed value
- `max` — maximum allowed value

### Date/Time Inputs

| Type | Value Type | Description |
|---|---|---|
| `Date` | LocalDate | Date only (no time) |
| `DateTime` | LocalDateTime / Instant | Date and time (local by default; timezone via config) |
| `Time` | LocalTime | Time only |

#### DateTime Config

```xml
<input name="mydatetime" type="DateTime">
  <label>My DateTime</label>
  <config>
    <timezone>true</timezone>
  </config>
  <default>2011-09-12</default>
</input>
```

- `timezone` — set to `true` to store value with timezone (produces `Instant`); default is `false` (produces `LocalDateTime`)
- `default` supports ISO 8601 format (`yyyy-MM-ddThh:mm`, with optional timezone offset) or relative expressions (e.g., `+1year -12hours`, `now`)

### Selection Inputs

| Type | Value Type | Description |
|---|---|---|
| `ComboBox` | String | Dropdown with predefined static options |
| `RadioButton` | String | Radio buttons for single selection |
| `CheckBox` | Boolean | Single true/false toggle |

> **Note:** CheckBox is a single boolean toggle. Occurrences are typically left at the default (`0..1`) or omitted entirely.

| `ContentSelector` | Reference (content ID) | Select existing content items |
| `ContentTypeFilter` | String | Select a content type |
| `CustomSelector` | String | Custom service-backed selector |

#### CheckBox Config

```xml
<input name="mycheckbox" type="CheckBox">
  <label>My Checkbox</label>
  <default>checked</default>
  <config>
    <alignment>right</alignment>
  </config>
</input>
```

- `alignment` — placement relative to label: `left` (default), `right`, `top`, `bottom`
- `default` — use `checked` to pre-select; default is unchecked

#### ContentTypeFilter Config

```xml
<input name="myctyfilter" type="ContentTypeFilter">
  <label>My ContentTypeFilter</label>
  <config>
    <context>true</context>
  </config>
</input>
```

- `context` — `true` limits content types to applications configured for the current site (default: `false`)

#### CustomSelector Config

```xml
<input name="mycustomselector" type="CustomSelector">
  <label>My Custom Selector</label>
  <config>
    <service>my-custom-selector</service>
    <param value="genre">classic</param>
    <galleryMode>true</galleryMode>
  </config>
</input>
```

- `service` — name of a JavaScript service at `/resources/services/[name]/[name].js`; can reference another app with `com.myapp:servicename`
- `param` — optional name-value parameters passed to the service as query params (repeatable)
- `galleryMode` — `true` displays options as a three-column image gallery

### Media Inputs

| Type | Value Type | Description |
|---|---|---|
| `ImageSelector` | Reference (content ID) | Select image content |
| `MediaSelector` | Reference (content ID) | Select any media content |
| `AttachmentUploader` | String (attachment name) | Upload directly to the content |

### Other Inputs

| Type | Value Type | Description |
|---|---|---|
| `GeoPoint` | GeoPoint | Latitude/longitude coordinates |
| `Tag` | String | Free-form tags |

### Common Input Attributes

```xml
<input name="fieldName" type="InputType">
  <label i18n="key">Display Label</label>        <!-- required -->
  <help-text>Explanation for editors</help-text>   <!-- optional -->
  <occurrences minimum="0" maximum="1"/>           <!-- optional; defaults 0..1 -->
  <default>value</default>                         <!-- optional -->
  <config>
    <!-- type-specific configuration -->
  </config>
</input>
```

**Occurrences rules:**
- `minimum="0"` — field is optional
- `minimum="1"` — field is mandatory
- `maximum="0"` — unlimited values (multi-value)
- `maximum="1"` — single value

### ComboBox Config Example

```xml
<input name="category" type="ComboBox">
  <label>Category</label>
  <occurrences minimum="1" maximum="1"/>
  <config>
    <option value="electronics">Electronics</option>
    <option value="clothing">Clothing</option>
    <option value="home">Home</option>
  </config>
</input>
```

### RadioButton Config Example

```xml
<input name="priority" type="RadioButton">
  <label>Priority</label>
  <config>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </config>
</input>
```

### ContentSelector Config Example

```xml
<input name="relatedArticles" type="ContentSelector">
  <label>Related Articles</label>
  <occurrences minimum="0" maximum="0"/>
  <config>
    <allowContentType>myapp:article</allowContentType>
    <allowPath>${site}/*</allowPath>
    <treeMode>true</treeMode>
    <hideToggleIcon>true</hideToggleIcon>
  </config>
</input>
```

- `allowContentType` — restrict selectable content types (repeatable; supports `${app}:name` shorthand)
- `allowPath` — restrict content by path (repeatable; supports `${site}/*`, `./*`, `../*`)
- `treeMode` — `true` shows content tree instead of flat list (default: `false`)
- `hideToggleIcon` — `true` hides the flat/tree toggle icon (default: `false`)

By default, ContentSelector only displays content from the same site.

### ImageSelector Config Example

```xml
<input name="images" type="ImageSelector">
  <label>Images</label>
  <occurrences minimum="0" maximum="0"/>
  <config>
    <allowPath>${site}/*</allowPath>
    <treeMode>true</treeMode>
    <hideToggleIcon>true</hideToggleIcon>
  </config>
</input>
```

ImageSelector supports the same config options as ContentSelector **except** `allowContentType` (it is always limited to `media:image`). By default, ImageSelector displays all images from the root.

### MediaSelector Config Example

```xml
<input name="mymedia" type="MediaSelector">
  <label>My Media</label>
  <occurrences minimum="0" maximum="1"/>
  <config>
    <allowContentType>media:archive</allowContentType>
    <allowPath>${site}/*</allowPath>
    <treeMode>true</treeMode>
    <hideToggleIcon>true</hideToggleIcon>
  </config>
</input>
```

MediaSelector supports the same config options as ContentSelector, but `allowContentType` is limited to `media:*` types. By default, MediaSelector displays all media from the root.

## Item Sets

Group repeatable nested form fields into a property set.

```xml
<item-set name="contact_info">
  <label>Contact Info</label>
  <occurrences minimum="0" maximum="0"/>
  <items>
    <input name="label" type="TextLine">
      <label>Label</label>
    </input>
    <input name="phone_number" type="TextLine">
      <label>Phone Number</label>
    </input>
  </items>
</item-set>
```

- `name` — used as the property key in persisted data
- `<items>` — contains input types, nested item-sets, or option-sets
- Item sets can be nested inside other item sets

## Option Sets

Present a set of mutually exclusive or multi-select options, each with optional sub-forms.

### Single-Select (radio-style)

```xml
<option-set name="blockType">
  <label>Block Type</label>
  <occurrences minimum="0" maximum="0"/>
  <options minimum="1" maximum="1">
    <option name="text">
      <label>Text Block</label>
      <items>
        <input name="body" type="HtmlArea">
          <label>Body</label>
          <occurrences minimum="1" maximum="1"/>
        </input>
      </items>
    </option>
    <option name="image">
      <label>Image Block</label>
      <items>
        <input name="image" type="ImageSelector">
          <label>Image</label>
          <occurrences minimum="1" maximum="1"/>
        </input>
      </items>
    </option>
  </options>
</option-set>
```

- `options/@maximum="1"` — single-select mode
- Each option can be empty or contain `<items>`

### Multi-Select (checkbox-style)

```xml
<option-set name="features">
  <label>Features</label>
  <expanded>true</expanded>
  <occurrences minimum="1" maximum="1"/>
  <options minimum="0" maximum="3">
    <option name="wifi">
      <label>WiFi</label>
      <default>true</default>
    </option>
    <option name="parking">
      <label>Parking</label>
    </option>
    <option name="pool">
      <label>Pool</label>
    </option>
  </options>
</option-set>
```

- `options/@maximum` > 1 — multi-select mode
- `<expanded>true</expanded>` — shows all options expanded by default
- `<default>true</default>` on an option — pre-selects it

## Mixins

Reusable form fragments stored at `src/main/resources/site/mixins/[name]/[name].xml`.

### Mixin Definition

```xml
<mixin>
  <display-name>Address</display-name>
  <form>
    <input type="TextLine" name="street">
      <label>Street</label>
    </input>
    <input type="TextLine" name="city">
      <label>City</label>
      <occurrences minimum="1" maximum="1"/>
    </input>
  </form>
</mixin>
```

### Mixin Reference (in content type)

```xml
<form>
  <input type="TextLine" name="name">
    <label>Name</label>
  </input>
  <mixin name="address"/>
</form>
```

The mixin fields are merged inline at the position of `<mixin name="..."/>`.

## X-Data

Extra data schemas that can be attached to any content type.

Location: `src/main/resources/site/x-data/[name]/[name].xml`

```xml
<x-data>
  <display-name>SEO Metadata</display-name>
  <form>
    <input type="TextLine" name="metaTitle">
      <label>Meta Title</label>
    </input>
    <input type="TextArea" name="metaDescription">
      <label>Meta Description</label>
    </input>
  </form>
</x-data>
```

## Field Sets (Decorative Grouping)

Group fields visually without affecting data structure:

```xml
<field-set name="personalInfo">
  <label>Personal Information</label>
  <items>
    <input name="firstName" type="TextLine">
      <label>First Name</label>
    </input>
    <input name="lastName" type="TextLine">
      <label>Last Name</label>
    </input>
  </items>
</field-set>
```

Field sets do **not** create a nested property — fields inside remain at the same level.

## Documentation Links

- Content Types: https://developer.enonic.com/docs/xp/stable/cms/content-types
- Input Types: https://developer.enonic.com/docs/xp/stable/cms/schemas/input-types
- Option Sets: https://developer.enonic.com/docs/xp/stable/cms/schemas/option-set
- Item Sets: https://developer.enonic.com/docs/xp/stable/cms/schemas/item-set
- Mixins: https://developer.enonic.com/docs/xp/stable/cms/schemas/mixins
- X-Data: https://developer.enonic.com/docs/xp/stable/cms/x-data
- Schema System: https://developer.enonic.com/docs/xp/stable/cms/schemas
