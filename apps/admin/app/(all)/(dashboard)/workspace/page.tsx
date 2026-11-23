/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useState } from "react";
import { observer } from "mobx-react";
import Link from "next/link";
import useSWR from "swr";
import { LoadingOutline as LoaderIcon } from "@makeplane/propel/icons";
// types
import { Button } from "@makeplane/propel/components/button";
import { Switch } from "@makeplane/propel/components/switch";
import { EmptyStateCompact } from "@plane/blocks/empty-state";
import type { TInstanceConfigurationKeys } from "@plane/types";
import { cn } from "@plane/utils";
// components
import { PageWrapper } from "@/components/common/page-wrapper";
import { Skeleton } from "@plane/blocks/skeleton";
import { WorkspaceListItem } from "@/components/workspace/list-item";
import { setPromiseToast } from "@plane/blocks/toast";
// hooks
import { useInstance, useWorkspace } from "@/hooks/store";
// types
import type { Route } from "./+types/page";

const WorkspaceManagementPage = observer(function WorkspaceManagementPage(_props: Route.ComponentProps) {
  // states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // store
  const { formattedConfig, fetchInstanceConfigurations, updateInstanceConfigurations } = useInstance();
  const {
    workspaceIds,
    loader: workspaceLoader,
    paginationInfo,
    fetchWorkspaces,
    fetchNextWorkspaces,
  } = useWorkspace();
  // derived values
  const disableWorkspaceCreation = formattedConfig?.DISABLE_WORKSPACE_CREATION ?? "";
  const hasNextPage = paginationInfo?.next_page_results && paginationInfo?.next_cursor !== undefined;

  // fetch data
  useSWR("INSTANCE_CONFIGURATIONS", () => fetchInstanceConfigurations());
  useSWR("INSTANCE_WORKSPACES", () => fetchWorkspaces());

  const updateConfig = async (key: TInstanceConfigurationKeys, value: string) => {
    setIsSubmitting(true);

    const payload = {
      [key]: value,
    };

    const updateConfigPromise = updateInstanceConfigurations(payload);

    setPromiseToast(updateConfigPromise, {
      loading: "正在保存配置",
      success: {
        title: "成功",
        message: () => "配置已保存",
      },
      error: {
        title: "错误",
        message: () => "保存配置失败",
      },
    });

    await updateConfigPromise
      .then(() => {
        setIsSubmitting(false);
      })
      .catch((err) => {
        console.error(err);
        setIsSubmitting(false);
      });
  };

  return (
    <PageWrapper
      header={{
        title: "此实例上的工作区",
        description: "查看所有工作区并控制谁可以创建工作区。",
      }}
    >
      <div className="space-y-3">
        {formattedConfig ? (
          <div className="flex w-full items-start justify-between gap-4 rounded-lg border border-subtle bg-layer-2 px-4 py-3 md:items-center md:gap-8">
            <div className="flex min-w-0 grow items-center gap-4">
              <div className="min-w-0 grow">
                <div className="pb-1 text-body-sm-medium text-primary">禁止其他人创建工作区。</div>
                <div className="text-body-xs-regular leading-5 text-tertiary">
                  开启后仅您本人可以创建工作区，其他用户需要由您邀请加入新的工作区。
                </div>
              </div>
            </div>
            <div className={cn("shrink-0", { "opacity-70": isSubmitting })}>
              <div className="flex items-center gap-4">
                <Switch
                  checked={Boolean(parseInt(disableWorkspaceCreation))}
                  onCheckedChange={() => {
                    if (Boolean(parseInt(disableWorkspaceCreation)) === true) {
                      updateConfig("DISABLE_WORKSPACE_CREATION", "0");
                    } else {
                      updateConfig("DISABLE_WORKSPACE_CREATION", "1");
                    }
                  }}
                  size="sm"
                  aria-label="禁止其他人创建工作区"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        ) : (
          <Skeleton>
            <Skeleton.Item height="50px" width="100%" />
          </Skeleton>
        )}
        {workspaceLoader !== "init-loader" ? (
          <>
            <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col items-start gap-x-2">
                <div className="flex items-center gap-2 text-body-md-medium">
                  此实例上的全部工作区 <span className="text-tertiary">• {workspaceIds.length}</span>
                  {workspaceLoader && ["mutation", "pagination"].includes(workspaceLoader) && (
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                  )}
                </div>
                <div className="text-body-xs-regular leading-5 text-tertiary">
                  目前暂不支持删除工作区；只有管理员或成员才能进入工作区。
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  stretch="auto"
                  nativeButton={false}
                  render={<Link href="/workspace/create" />}
                  label="创建工作区"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 py-2">
              {workspaceIds.length > 0 ? (
                workspaceIds.map((workspaceId) => <WorkspaceListItem key={workspaceId} workspaceId={workspaceId} />)
              ) : paginationInfo ? (
                <EmptyStateCompact
                  assetKey="project"
                  title="暂无工作区"
                  description="在此实例上创建的工作区将显示在这里。"
                  rootClassName="rounded-lg border border-subtle py-10"
                />
              ) : null}
            </div>
            {hasNextPage && (
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="md"
                  stretch="auto"
                  onClick={() => fetchNextWorkspaces()}
                  loading={workspaceLoader === "pagination"}
                  label="加载更多"
                />
              </div>
            )}
          </>
        ) : (
          <Skeleton className="space-y-10 py-8">
            <Skeleton.Item height="24px" width="20%" />
            <Skeleton.Item height="92px" width="100%" />
            <Skeleton.Item height="92px" width="100%" />
            <Skeleton.Item height="92px" width="100%" />
          </Skeleton>
        )}
      </div>
    </PageWrapper>
  );
});

export const meta: Route.MetaFunction = () => [{ title: "工作区管理 - 管理后台" }];

export default WorkspaceManagementPage;
