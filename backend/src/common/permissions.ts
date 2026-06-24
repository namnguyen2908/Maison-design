import { RoleName } from '../roles/entities/role.entity';

export const Permission = {
  // Users
  UsersRead: 'users:read',
  UsersCreate: 'users:create',
  UsersUpdate: 'users:update',
  UsersDelete: 'users:delete',
  UsersManageRoles: 'users:manage_roles',

  // Projects
  ProjectsRead: 'projects:read',
  ProjectsCreate: 'projects:create',
  ProjectsUpdate: 'projects:update',
  ProjectsDelete: 'projects:delete',

  // Stages
  StagesRead: 'stages:read',
  StagesCreate: 'stages:create',
  StagesUpdate: 'stages:update',
  StagesDelete: 'stages:delete',

  // Rooms
  RoomsRead: 'rooms:read',
  RoomsCreate: 'rooms:create',
  RoomsUpdate: 'rooms:update',
  RoomsDelete: 'rooms:delete',
  RoomsApprove: 'rooms:approve',

  // Designs
  DesignsRead: 'designs:read',
  DesignsUpload: 'designs:upload',

  // Annotations
  AnnotationsRead: 'annotations:read',
  AnnotationsCreate: 'annotations:create',
  AnnotationsResolve: 'annotations:resolve',
  AnnotationsComment: 'annotations:comment',

  // Notifications
  NotificationsRead: 'notifications:read',

  // Upload
  UploadImage: 'upload:image',

  // Roles
  RolesRead: 'roles:read',
  RolesCreate: 'roles:create',
  RolesUpdate: 'roles:update',
  RolesDelete: 'roles:delete',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

export const RolePermissions: Record<RoleName, Permission[]> = {
  [RoleName.SuperAdmin]: Object.values(Permission),

  [RoleName.Admin]: [
    Permission.UsersRead,
    Permission.UsersCreate,
    Permission.UsersUpdate,
    Permission.ProjectsRead,
    Permission.ProjectsCreate,
    Permission.ProjectsUpdate,
    Permission.ProjectsDelete,
    Permission.StagesCreate,
    Permission.StagesUpdate,
    Permission.StagesDelete,
    Permission.RoomsCreate,
    Permission.RoomsUpdate,
    Permission.RoomsDelete,
    Permission.DesignsRead,
    Permission.DesignsUpload,
    Permission.AnnotationsRead,
    Permission.AnnotationsCreate,
    Permission.AnnotationsResolve,
    Permission.AnnotationsComment,
    Permission.NotificationsRead,
    Permission.UploadImage,
    Permission.RolesRead,
    Permission.RolesCreate,
    Permission.RolesUpdate,
  ],

  [RoleName.Designer]: [
    Permission.ProjectsRead,
    Permission.ProjectsUpdate,
    Permission.StagesRead,
    Permission.StagesUpdate,
    Permission.RoomsRead,
    Permission.RoomsCreate,
    Permission.RoomsUpdate,
    Permission.DesignsRead,
    Permission.DesignsUpload,
    Permission.AnnotationsRead,
    Permission.AnnotationsCreate,
    Permission.AnnotationsResolve,
    Permission.AnnotationsComment,
    Permission.NotificationsRead,
    Permission.UploadImage,
  ],

  [RoleName.Customer]: [
    Permission.ProjectsRead,
    Permission.DesignsRead,
    Permission.AnnotationsRead,
    Permission.AnnotationsCreate,
    Permission.AnnotationsComment,
    Permission.NotificationsRead,
    Permission.RoomsApprove,
  ],
};

export const DefaultPermissions: Record<string, Permission[]> = {
  ...RolePermissions,
};
