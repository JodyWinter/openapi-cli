import { outdent } from 'outdent';
import { lintDocument } from '../../../lint';
import { parseYamlToDocument, replaceSourceWithRef, makeConfig } from '../../../../__tests__/utils';
import { BaseResolver } from '../../../resolve';

describe('Oas3 operation-singular-tag', () => {
  it('should report on operation object if more than one tag', async () => {
    const document = parseYamlToDocument(
      outdent`
          openapi: 3.0.0
          tags:
            - name: a
            - name: b
          paths:
            /some:
              get:
                tags:
                  - a
                  - b
        `,
      'foobar.yaml',
    );

    const results = await lintDocument({
      externalRefResolver: new BaseResolver(),
      document,
      config: makeConfig({ 'operation-singular-tag': 'error' }),
    });

    expect(replaceSourceWithRef(results)).toMatchInlineSnapshot(`
      Array [
        Object {
          "location": Array [
            Object {
              "pointer": "#/paths/~1some/get/tags",
              "reportOnKey": true,
              "source": "foobar.yaml",
            },
          ],
          "message": "Operation \`tags\` object should have only one tag.",
          "ruleId": "operation-singular-tag",
          "severity": "error",
          "suggest": Array [],
        },
      ]
    `);
  });

  it('should not report on operation object if only one tag', async () => {
    const document = parseYamlToDocument(
      outdent`
      openapi: 3.0.0
      tags:
        - name: a
      paths:
        /some:
          get:
            tags:
              - a
        `,
      'foobar.yaml',
    );

    const results = await lintDocument({
      externalRefResolver: new BaseResolver(),
      document,
      config: makeConfig({ 'operation-singular-tag': 'error' }),
    });

    expect(replaceSourceWithRef(results)).toMatchInlineSnapshot(`Array []`);
  });
});
