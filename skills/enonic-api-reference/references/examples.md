# Cross-Library Usage Patterns

Common patterns combining multiple Enonic XP `/lib/xp/*` libraries.

## Run code as a different user

Use `lib-context` to execute code with elevated permissions:

```ts
import contextLib from '/lib/xp/context';
import contentLib from '/lib/xp/content';

const result = contextLib.run({
    repository: 'com.enonic.cms.default',
    branch: 'draft',
    user: { login: 'su', idProvider: 'system' },
    principals: ['role:system.admin']
}, () => {
    return contentLib.query({
        query: "type = 'portal:site'",
        count: 100
    });
});
```

## Create content and publish it

```ts
import {create, publish} from '/lib/xp/content';

const content = create({
    name: 'my-article',
    parentPath: '/my-site/articles',
    displayName: 'My Article',
    contentType: 'com.example.myapp:article',
    data: { title: 'Hello', body: 'World' }
});

publish({
    keys: [content._id],
    sourceBranch: 'draft',
    targetBranch: 'master'
});
```

## Background task with progress reporting

```ts
import {executeFunction, progress} from '/lib/xp/task';
import {query} from '/lib/xp/content';

const taskId = executeFunction({
    description: 'Process all articles',
    func: () => {
        const result = query({ query: "type = 'article'", count: 0 });
        const total = result.total;

        const items = query({ query: "type = 'article'", count: total });
        items.hits.forEach((item, i) => {
            progress({ info: `Processing ${item._name}`, current: i + 1, total });
            // ... process item ...
        });

        progress({ info: 'Completed' });
    }
});
```

## Listen for content changes and send notification

```ts
import eventLib from '/lib/xp/event';
import {send} from '/lib/xp/mail';

eventLib.listener({
    type: 'node.updated',
    callback: (event) => {
        send({
            from: 'system@example.com',
            to: 'admin@example.com',
            subject: 'Content updated',
            body: `Nodes updated: ${JSON.stringify(event.data.nodes)}`
        });
    }
});
```

## Low-level node operations with lib-node

```ts
import {connect} from '/lib/xp/node';

const repo = connect({ repoId: 'com.enonic.cms.default', branch: 'draft' });

// Create a node
const node = repo.create({
    _name: 'my-data',
    _parentPath: '/',
    myField: 'value'
});

// Query nodes
const result = repo.query({
    query: "myField = 'value'",
    count: 10
});

// Modify a node
repo.modify({
    key: node._id,
    editor: (n) => { n.myField = 'updated'; return n; }
});
```

## Create user and assign to group

```ts
import {createUser, addMembers} from '/lib/xp/auth';

const user = createUser({
    idProvider: 'system',
    name: 'new-editor',
    displayName: 'New Editor',
    email: 'editor@example.com'
});

addMembers('group:system:content-managers', ['user:system:new-editor']);
```

## Read a resource and stream it

```ts
import {getResource, readText} from '/lib/xp/io';

const resource = getResource('/lib/xp/examples/io/sample.txt');
if (resource.exists()) {
    const text = readText(resource.getStream());
    log.info('File content: %s', text);
}
```

## Repository management

```ts
import {create, createBranch, delete as deleteRepo} from '/lib/xp/repo';

// Create a custom repository
const repo = create({ id: 'my-custom-repo' });

// Create a branch
createBranch({ repoId: 'my-custom-repo', branchId: 'staging' });

// Clean up
deleteRepo('my-custom-repo');
```
