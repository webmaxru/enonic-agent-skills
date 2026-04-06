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
  <default><h3>Enter description here</h3></default>
  <config>
    <exclude>*</exclude>
    <include>JustifyLeft JustifyRight | Bold Italic</include>
    <allowHeadings>h2 h4 h6</allowHeadings>
  </config>
</input>
```

- `default` — can contain any valid HTML elements (tags must be correctly closed since the schema is XML)
- `exclude` — remove tools from toolbar (use `*` to remove all)
- `include` — add tools to toolbar (separate with space, group with `|`)
- `allowHeadings` — space-separated list of allowed heading tags (`h1` through `h6`; all allowed by default)

Default toolbar: `Format | JustifyBlock JustifyLeft JustifyCenter JustifyRight | BulletedList NumberedList Outdent Indent | FindAndReplace SpecialChar Anchor Image Macro Link Unlink | Table | PasteModeSwitcher`

All available editor tools:

| Tool | Description |
|---|---|
| `Format` | Text format menu |
| `Bold` | Bold text |
| `Italic` | Italic text |
| `Underline` | Underline text |
| `JustifyBlock` | Justify content |
| `JustifyLeft` | Left align content |
| `JustifyCenter` | Center content |
| `JustifyRight` | Right align content |
| `BulletedList` | Insert a bullet list |
| `NumberedList` | Insert a numbered list |
| `Outdent` | Decrease indent |
| `Indent` | Increase indent |
| `FindAndReplace` | Find and Replace dialog |
| `SpecialChar` | Insert a special character |
| `Anchor` | Insert an anchor |
| `Image` | Insert/Edit an image |
| `Macro` | Insert a macro |
| `Link` | Insert/Edit a link |
| `Unlink` | Remove link |
| `Table` | Table format menu |
| `PasteModeSwitcher` | Paste mode (formatted/plain text) |
| `BGColor` | Background color |
| `Blockquote` | Quotation |
| `Copy` | Copy selected text into buffer |
| `CopyFormatting` | Copy formatting |
| `CreateDiv` | Wrap with div |
| `Cut` | Cut selected text into buffer |
| `Font` | Font menu |
| `FontSize` | Font size menu |
| `HorizontalRule` | Insert a horizontal line |
| `Language` | Set language for parts of the text |
| `ListStyle` | Change style of BulletedList |
| `NewPage` | Clean editor's content |
| `Preview` | Preview HTML Area contents |
| `Redo` | Repeat the last action |
| `RemoveFormat` | Remove formatting |
| `SelectAll` | Select editor's content |
| `Strike` | Strikethrough over text |
| `Styles` | Text styles menu |
| `Subscript` | Subscript text |
| `Superscript` | Superscript text |
| `TextColor` | Text color |
| `Undo` | Undo the last action |

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
- `default` supports:
  - ISO 8601 format with timezone: `yyyy-MM-ddThh:mm±hh:mm` (e.g., `2016-12-31T23:59+01:00`)
  - ISO 8601 format without timezone: `yyyy-MM-ddThh:mm` (e.g., `2016-12-31T23:59`)
  - Relative expressions (e.g., `+1year -12hours`, `now`)

#### Date Config

```xml
<input name="mydate" type="Date">
  <label>My Date</label>
  <default>2011-09-12</default>
</input>
```

- `default` supports ISO 8601 format (`yyyy-MM-dd`) or relative date expressions (e.g., `+1year -12days`, `now`)

#### Time Config

```xml
<input name="mytime" type="Time">
  <label>My Time</label>
  <default>13:22</default>
</input>
```

- `default` supports 24h format (`hh:mm`) or relative time expressions (e.g., `+1hour -12minutes`, `now`)

#### Relative Expression Unit Strings

| Singular | Plural | Initial Letter |
|---|---|---|
| `year` | `years` | `y` |
| `month` | `months` | `M` |
| `week` | `weeks` | `w` |
| `day` | `days` | `d` |
| `hour` | `hours` | `h` |
| `minute` | `minutes` | `m` |

Date type supports `year`, `month`, `week`, `day`. Time type supports `hour`, `minute`. DateTime supports all units.

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

#### GeoPoint Config

```xml
<input name="mygeopoint" type="GeoPoint">
  <label>My GeoPoint</label>
  <occurrences minimum="0" maximum="1"/>
  <default>51.5,-0.1</default>
</input>
```

- `default` — comma-separated latitude and longitude (e.g., `51.5,-0.1`). Latitude: -90 to 90. Longitude: -180 to 180.

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
  <default>electronics</default>
</input>
```

- `option` elements and the `@value` attribute define the value stored when the option is selected. Multiple `option` elements are allowed and ordered.
- `default` — optional, must equal one of the option values

### RadioButton Config Example

```xml
<input name="priority" type="RadioButton">
  <label>Priority</label>
  <occurrences minimum="1" maximum="1"/>
  <config>
    <option value="low" i18n="priority.low.label">Low</option>
    <option value="medium" i18n="priority.medium.label">Medium</option>
    <option value="high" i18n="priority.high.label">High</option>
  </config>
  <default>medium</default>
</input>
```

- `option` elements and the `@value` attribute define the value stored when the option is selected. Optional `i18n` attribute localizes the option label.
- `occurrences` — only `minimum="0"` or `minimum="1"` is meaningful; `maximum` is always `1`
- `default` — optional, must equal one of the option values

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

### X-Data in site.xml

Attach x-data to content types via `site.xml`. Use `allowContentTypes` with regular expressions to restrict which content types receive the x-data. Set `optional="true"` to let editors enable it manually in the Content Wizard.

```xml
<site>
  <x-data name="my-x-data-1" />
  <x-data name="my-x-data-2" allowContentTypes="^(?!base:folder$).*" />
  <x-data name="my-x-data-3" allowContentTypes="portal:site" optional="true" />
  <form/>
</site>
```

- No attributes — x-data is enabled for all content types with no option to remove it
- `allowContentTypes` — regex pattern to match content type names; unmatched types will not see the x-data
- `optional="true"` — editors must manually enable the x-data in Content Wizard

## Field Sets (Decorative Grouping)

Group fields visually without affecting data structure. Field sets do **not** need a `name` attribute since they are only visual and do **not** affect the data model:

```xml
<field-set>
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

Fields inside a field set remain at the same level in the persisted data — no nested property is created.

## Documentation Links

- Content Types: https://developer.enonic.com/docs/xp/stable/cms/content-types
- Input Types: https://developer.enonic.com/docs/xp/stable/cms/schemas/input-types
- Option Sets: https://developer.enonic.com/docs/xp/stable/cms/schemas/option-set
- Item Sets: https://developer.enonic.com/docs/xp/stable/cms/schemas/item-set
- Mixins: https://developer.enonic.com/docs/xp/stable/cms/schemas/mixins
- X-Data: https://developer.enonic.com/docs/xp/stable/cms/x-data
- Schema System: https://developer.enonic.com/docs/xp/stable/cms/schemas
