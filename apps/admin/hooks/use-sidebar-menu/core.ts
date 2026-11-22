/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

// plane imports
import {
  AiStarFourOutline,
  ImageOutline,
  LockOutline,
  MailOutline,
  SettingsOutline,
  WorkspaceOutline,
} from "@makeplane/propel/icons";
// types
import type { TSidebarMenuItem } from "./types";

export type TCoreSidebarMenuKey = "general" | "email" | "workspace" | "authentication" | "ai" | "image";

export const coreSidebarMenuLinks: Record<TCoreSidebarMenuKey, TSidebarMenuItem> = {
  general: {
    Icon: SettingsOutline,
    name: "常规",
    description: "查看实例信息并获取关键详情。",
    href: `/general/`,
  },
  email: {
    Icon: MailOutline,
    name: "邮箱",
    description: "配置 SMTP 邮件服务。",
    href: `/email/`,
  },
  workspace: {
    Icon: WorkspaceOutline,
    name: "工作区",
    description: "管理此实例上的所有工作区。",
    href: `/workspace/`,
  },
  authentication: {
    Icon: LockOutline,
    name: "身份验证",
    description: "配置身份验证方式。",
    href: `/authentication/`,
  },
  ai: {
    Icon: AiStarFourOutline,
    name: "人工智能",
    description: "配置 OpenAI 凭据。",
    href: `/ai/`,
  },
  image: {
    Icon: ImageOutline,
    name: "Plane 图床",
    description: "允许第三方图床。",
    href: `/image/`,
  },
};
