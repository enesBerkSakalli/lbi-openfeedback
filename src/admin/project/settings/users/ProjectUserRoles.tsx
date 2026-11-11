export const PROJECT_USER_ROLE_MEMBER = 'Member'
export const PROJECT_USER_ROLE_OWNER = 'Owner'

export type ProjectUserRole =
    | typeof PROJECT_USER_ROLE_MEMBER
    | typeof PROJECT_USER_ROLE_OWNER
