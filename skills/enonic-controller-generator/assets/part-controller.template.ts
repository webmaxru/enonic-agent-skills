// Part controller template for Enonic XP
// Replace <PART_NAME> with the actual part name (e.g., "hero-banner")
// XP 8: Pair with descriptor: src/main/resources/cms/parts/<PART_NAME>/<PART_NAME>.yaml
// XP 7: Pair with descriptor: src/main/resources/site/parts/<PART_NAME>/<PART_NAME>.xml

import { getComponent, imageUrl } from '/lib/xp/portal';
import thymeleafLib from '/lib/thymeleaf';

const view = resolve('<PART_NAME>.html');

// XP 8: Use uppercase GET. XP 7: Use lowercase get.
export function GET(req) {
  const component = getComponent();
  const config = component.config;

  const model = {
    // Map config fields to view model properties
    // Example: heading: config.heading || 'Default Heading',
  };

  return {
    body: thymeleafLib.render(view, model),
    contentType: 'text/html'
  };
}

/*
--- Paired YAML Descriptor (XP 8) ---
File: src/main/resources/cms/parts/<PART_NAME>/<PART_NAME>.yaml

kind: "Part"
title: "PART_DISPLAY_NAME"
description: "PART_DESCRIPTION"
form:
  # Add form items here
  # - name: "heading"
  #   type: "TextLine"
  #   label: "Heading"
  #   occurrences:
  #     min: 1
  #     max: 1

--- Paired XML Descriptor (XP 7) ---
File: src/main/resources/site/parts/<PART_NAME>/<PART_NAME>.xml

<part>
  <display-name>PART_DISPLAY_NAME</display-name>
  <description>PART_DESCRIPTION</description>
  <form>
    <!-- Add input fields here -->
    <!--
    <input name="heading" type="TextLine">
      <label>Heading</label>
      <occurrences minimum="1" maximum="1"/>
    </input>
    -->
  </form>
</part>
*/
