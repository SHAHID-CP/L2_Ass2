export const USER_ROLE = {
  contributor: "contributor",
  maintainer: "maintainer",
} as const;

export const allowedRoles = [USER_ROLE.contributor, USER_ROLE.maintainer];

