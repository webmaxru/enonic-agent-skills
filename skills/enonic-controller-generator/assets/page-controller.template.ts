// Page controller template for Enonic XP
// Replace <PAGE_NAME> with the actual page name (e.g., "default")
// XP 8: Pair with descriptor: src/main/resources/cms/pages/<PAGE_NAME>/<PAGE_NAME>.yaml
// XP 7: Pair with descriptor: src/main/resources/site/pages/<PAGE_NAME>/<PAGE_NAME>.xml

import { getContent, pageUrl } from '/lib/xp/portal';
import thymeleafLib from '/lib/thymeleaf';

const view = resolve('<PAGE_NAME>.html');

// XP 8: Use uppercase GET. XP 7: Use lowercase get.
export function GET(req) {
  const content = getContent();

  const model = {
    displayName: content.displayName,
    mainRegion: content.page.regions.main
    // Add additional regions as needed
  };

  return {
    body: thymeleafLib.render(view, model),
    contentType: 'text/html'
  };
}

/*
--- Paired YAML Descriptor (XP 8) ---
File: src/main/resources/cms/pages/<PAGE_NAME>/<PAGE_NAME>.yaml

kind: "Page"
title: "PAGE_DISPLAY_NAME"
description: "PAGE_DESCRIPTION"
form: []
regions:
  - name: "main"

--- Paired XML Descriptor (XP 7) ---
File: src/main/resources/site/pages/<PAGE_NAME>/<PAGE_NAME>.xml

<page>
  <display-name>PAGE_DISPLAY_NAME</display-name>
  <description>PAGE_DESCRIPTION</description>
  <form/>
  <regions>
    <region name="main"/>
  </regions>
</page>

--- Paired Thymeleaf View ---
File: src/main/resources/site/pages/<PAGE_NAME>/<PAGE_NAME>.html

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title data-th-text="${displayName}">Page Title</title>
</head>
<body>
  <main data-portal-region="main">
    <div data-th-each="component : ${mainRegion.components}"
         data-th-remove="tag"
         data-portal-component="${component.path}">
    </div>
  </main>
</body>
</html>
*/
