/**
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 */

export class OidcConfig {
  private static readonly adminRolePermissions: string[] = [
    'Overall/Administer',
    'Overall/Read',
    'Job/Move',
    'Job/Build',
    'Job/Read',
    'Job/Delete',
    'Job/Create',
    'Job/Discover',
    'Job/Cancel',
    'Job/Configure',
    'Job Config History/DeleteEntry',
    'Job/Workspace',
    'Credentials/Delete',
    'Credentials/ManageDomains',
    'Credentials/Update',
    'Credentials/View',
    'Credentials/Create',
    'Manage ownership/Nodes',
    'Manage ownership/Jobs',
    'Agent/Configure',
    'Agent/Create',
    'Agent/Build',
    'Agent/Provision',
    'Agent/Connect',
    'Agent/Delete',
    'Agent/Disconnect',
    'Run/Replay',
    'Run/Delete',
    'Run/Update',
    'View/Delete',
    'View/Read',
    'View/Create',
    'View/Configure',
    'SCM/Tag',
  ];

  private static readonly readOnlyRolePermissions: string[] = [
    'Overall/Read',
    'Job/Read',
    'View/Read',
  ];

  public static addOidcConfigToJenkinsYaml(yamlObject: any, admins?: string[]): any {
    const jenkinsYaml: any = yamlObject;
    let adminUsers: string[] = ['admin'];
    const readOnlyUsers: string[] = ['anonymous', 'authenticated'];

    if (admins) {
      adminUsers = adminUsers.concat(admins);
    }

    const githubOidcConfig: { [x: string]: any; } = {
      github: {
        githubWebUri: 'https://github.com',
        githubApiUri: 'https://api.github.com',
        clientID: 'cliendId',
        clientSecret: 'clientSecret',
        oauthScopes: 'read:org,user:email',
      },
    };

    const rolesAndPermissions: { [x: string]: any; } = {
      roleBased: {
        roles: {
          global: [{
            entries: adminUsers.map((user) => ({ user })),
            name: 'admin',
            pattern: '.*',
            permissions: OidcConfig.adminRolePermissions
            ,
          },
          {
            entries: readOnlyUsers.map((user) => ({ user })),
            name: 'read',
            pattern: '.*',
            permissions: OidcConfig.readOnlyRolePermissions,
          },

          ],
        },
      },
    };

    jenkinsYaml.jenkins.authorizationStrategy = rolesAndPermissions;
    jenkinsYaml.jenkins.securityRealm = githubOidcConfig;
    return jenkinsYaml;
  }
}
