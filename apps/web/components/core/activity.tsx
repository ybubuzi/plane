/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useEffect } from "react";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
// store hooks
// icons
import {
  ArchiveOutline,
  AttachOutline,
  CalendarOutline,
  ChatOutline,
  CyclesOutline,
  DuplicateOfOutline,
  EpicOutline,
  EstimateOutline,
  GridOutline,
  IntakeOutline,
  LabelsOutline,
  LinkOutline,
  MembersOutline,
  ModuleOutline,
  PriorityMedium,
  RelatesToOutline,
  WorkItemsOutline,
} from "@makeplane/propel/icons";
import { BlockedIcon, BlockerIcon } from "@plane/blocks/icons";
import { Tooltip } from "@makeplane/propel/components/tooltip";
import type { IIssueActivity } from "@plane/types";
import { renderFormattedDate, generateWorkItemLink } from "@plane/utils";
// helpers
import { useLabel } from "@/hooks/store/use-label";
import { usePlatformOS } from "@/hooks/use-platform-os";
// types

export function IssueLink({ activity }: { activity: IIssueActivity }) {
  // router params
  const { workspaceSlug } = useParams();
  const { isMobile } = usePlatformOS();

  const workItemLink = generateWorkItemLink({
    workspaceSlug: workspaceSlug?.toString() ?? activity.workspace_detail?.slug,
    projectId: activity?.project,
    issueId: activity?.issue,
    projectIdentifier: activity?.project_detail?.identifier,
    sequenceId: activity?.issue_detail?.sequence_id,
  });

  return (
    <Tooltip
      label={activity?.issue_detail ? activity.issue_detail.name : "该工作项已被删除"}
      layout="stacked"
      disabled={isMobile}
    >
      {activity?.issue_detail ? (
        <a
          aria-disabled={activity.issue === null}
          href={workItemLink}
          target={activity.issue === null ? "_self" : "_blank"}
          rel={activity.issue === null ? "" : "noopener noreferrer"}
          className="inline items-center gap-1 font-medium text-primary hover:underline"
        >
          <span className="whitespace-nowrap">{`${activity.project_detail.identifier}-${activity.issue_detail.sequence_id}`}</span>{" "}
          <span className="font-regular break-all">{activity.issue_detail?.name}</span>
        </a>
      ) : (
        <span className="inline-flex items-center gap-1 font-medium whitespace-nowrap text-primary">
          {"一个工作项"}{" "}
        </span>
      )}
    </Tooltip>
  );
}

function UserLink({ activity }: { activity: IIssueActivity }) {
  // router params
  const { workspaceSlug } = useParams();

  return (
    <a
      href={`/${workspaceSlug ?? activity.workspace_detail?.slug}/profile/${
        activity.new_identifier ?? activity.old_identifier
      }`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center font-medium text-primary hover:underline"
    >
      {activity.new_value && activity.new_value !== "" ? activity.new_value : activity.old_value}
    </a>
  );
}

const LabelPill = observer(function LabelPill({ labelId, workspaceSlug }: { labelId: string; workspaceSlug: string }) {
  // store hooks
  const { workspaceLabels, fetchWorkspaceLabels } = useLabel();

  useEffect(() => {
    if (!workspaceLabels) fetchWorkspaceLabels(workspaceSlug);
  }, [fetchWorkspaceLabels, workspaceLabels, workspaceSlug]);

  return (
    <span
      className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
      style={{
        backgroundColor: workspaceLabels?.find((l) => l.id === labelId)?.color ?? "#000000",
      }}
      aria-hidden="true"
    />
  );
});

const inboxActivityMessage = {
  declined: {
    showIssue: "拒绝了工作项",
    noIssue: "从收件箱拒绝了该工作项。",
  },
  snoozed: {
    showIssue: "暂停了工作项",
    noIssue: "暂停了该工作项。",
  },
  accepted: {
    showIssue: "接受了工作项",
    noIssue: "从收件箱接受了该工作项。",
  },
  markedDuplicate: {
    showIssue: "拒绝了工作项",
    noIssue: "通过标记重复工作项，从收件箱拒绝了该工作项。",
  },
};

const getInboxUserActivityMessage = (activity: IIssueActivity, showIssue: boolean) => {
  switch (activity.verb) {
    case "-1":
      return showIssue ? inboxActivityMessage.declined.showIssue : inboxActivityMessage.declined.noIssue;
    case "0":
      return showIssue ? inboxActivityMessage.snoozed.showIssue : inboxActivityMessage.snoozed.noIssue;
    case "1":
      return showIssue ? inboxActivityMessage.accepted.showIssue : inboxActivityMessage.accepted.noIssue;
    case "2":
      return showIssue ? inboxActivityMessage.markedDuplicate.showIssue : inboxActivityMessage.markedDuplicate.noIssue;
    default:
      return "更新了收件箱工作项状态。";
  }
};

const PRIORITY_LABELS: Record<string, string> = {
  urgent: "紧急",
  high: "高",
  medium: "中",
  low: "低",
  none: "无",
};

const activityDetails: {
  [key: string]: {
    message: (activity: IIssueActivity, showIssue: boolean, workspaceSlug: string) => React.ReactNode;
    icon: React.ReactNode;
  };
} = {
  assignees: {
    message: (activity, showIssue) => {
      if (activity.old_value === "")
        return (
          <>
            添加了新负责人 <UserLink activity={activity} />
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
      else
        return (
          <>
            移除了负责人 <UserLink activity={activity} />
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
    },
    icon: <MembersOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  archived_at: {
    message: (activity) => {
      if (activity.new_value === "restore")
        return (
          <>
            恢复了 <IssueLink activity={activity} />
          </>
        );
      else
        return (
          <>
            归档了 <IssueLink activity={activity} />
          </>
        );
    },
    icon: <ArchiveOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  attachment: {
    message: (activity, showIssue) => {
      if (activity.verb === "created")
        return (
          <>
            上传了新附件
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
      else
        return (
          <>
            移除了一个附件
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
    },
    icon: <AttachOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  description: {
    message: (activity, showIssue) => (
      <>
        更新了描述
        {showIssue && (
          <>
            ，工作项 <IssueLink activity={activity} />
          </>
        )}
      </>
    ),
    icon: <ChatOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  estimate_point: {
    message: (activity, showIssue) => {
      if (!activity.new_value)
        return (
          <>
            移除了估算点
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
      else
        return (
          <>
            将估算点设置为 {activity.new_value}
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
    },
    icon: <EstimateOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  issue: {
    message: (activity) => {
      if (activity.verb === "created")
        return (
          <>
            创建了 <IssueLink activity={activity} />
          </>
        );
      else if (activity.verb === "converted")
        return (
          <>
            将 <IssueLink activity={activity} /> 转换为史诗
          </>
        );
      else
        return (
          <>
            删除了 <IssueLink activity={activity} />
          </>
        );
    },
    icon: <WorkItemsOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  epic: {
    message: (activity) => {
      if (activity.verb === "created")
        return (
          <>
            创建了 <IssueLink activity={activity} />
          </>
        );
      else if (activity.verb === "converted")
        return (
          <>
            将 <IssueLink activity={activity} /> 转换为工作项
          </>
        );
      else
        return (
          <>
            删除了 <IssueLink activity={activity} />
          </>
        );
    },
    icon: <EpicOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  labels: {
    message: (activity, showIssue, workspaceSlug) => {
      if (activity.old_value === "")
        return (
          <span className="overflow-hidden">
            添加了新标签{" "}
            <span className="inline-flex items-center gap-2 rounded-full border border-strong px-2 py-0.5 text-caption-sm-regular">
              <LabelPill labelId={activity.new_identifier ?? ""} workspaceSlug={workspaceSlug} />
              <span className="line-clamp-1 flex-shrink font-medium break-all text-primary">{activity.new_value}</span>
            </span>
            {showIssue && (
              <span className="">
                ，工作项 <IssueLink activity={activity} />
              </span>
            )}
          </span>
        );
      else
        return (
          <>
            移除了标签{" "}
            <span className="inline-flex items-center gap-2 rounded-full border border-strong px-2 py-0.5 text-caption-sm-regular">
              <LabelPill labelId={activity.old_identifier ?? ""} workspaceSlug={workspaceSlug} />
              <span className="line-clamp-1 flex-shrink font-medium break-all text-primary">{activity.old_value}</span>
            </span>
            {showIssue && (
              <span>
                ，工作项 <IssueLink activity={activity} />
              </span>
            )}
          </>
        );
    },
    icon: <LabelsOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  link: {
    message: (activity, showIssue) => {
      if (activity.verb === "created")
        return (
          <>
            添加了此{" "}
            <a
              href={`${activity.new_value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              链接
            </a>
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
      else if (activity.verb === "updated")
        return (
          <>
            更新了此{" "}
            <a
              href={`${activity.old_value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              链接
            </a>
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
      else
        return (
          <>
            移除了此{" "}
            <a
              href={`${activity.old_value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              链接
            </a>
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
    },
    icon: <LinkOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  cycles: {
    message: (activity, showIssue, workspaceSlug) => {
      if (activity.verb === "created")
        return (
          <>
            <span className="flex-shrink-0">
              将 {showIssue ? <IssueLink activity={activity} /> : "该工作项"}{" "}
              <span className="whitespace-nowrap">添加到迭代</span>{" "}
            </span>
            <a
              href={`/${workspaceSlug}/projects/${activity.project}/cycles/${activity.new_identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline items-center gap-1 font-medium text-primary hover:underline"
            >
              <span className="break-all">{activity.new_value}</span>
            </a>
          </>
        );
      else if (activity.verb === "updated")
        return (
          <>
            <span className="flex-shrink-0 whitespace-nowrap">将迭代设置为 </span>
            <a
              href={`/${workspaceSlug}/projects/${activity.project}/cycles/${activity.new_identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline items-center gap-1 font-medium text-primary hover:underline"
            >
              <span className="break-all">{activity.new_value}</span>
            </a>
          </>
        );
      else
        return (
          <>
            从迭代{" "}
            <a
              href={`/${workspaceSlug}/projects/${activity.project}/cycles/${activity.old_identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline items-center gap-1 font-medium text-primary hover:underline"
            >
              <span className="break-all">{activity.old_value}</span>
            </a>
            {" "}中移除了 <IssueLink activity={activity} />
          </>
        );
    },
    icon: <CyclesOutline height={12} width={12} className="text-secondary" aria-hidden="true" />,
  },
  modules: {
    message: (activity, showIssue, workspaceSlug) => {
      if (activity.verb === "created")
        return (
          <>
            将 {showIssue ? <IssueLink activity={activity} /> : "该工作项"} 添加到模块{" "}
            <a
              href={`/${workspaceSlug}/projects/${activity.project}/modules/${activity.new_identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline items-center gap-1 font-medium text-primary hover:underline"
            >
              <span className="break-all">{activity.new_value}</span>
            </a>
          </>
        );
      else if (activity.verb === "updated")
        return (
          <>
            将模块设置为{" "}
            <a
              href={`/${workspaceSlug}/projects/${activity.project}/modules/${activity.new_identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline items-center gap-1 font-medium text-primary hover:underline"
            >
              <span className="break-all">{activity.new_value}</span>
            </a>
          </>
        );
      else
        return (
          <>
            从模块{" "}
            <a
              href={`/${workspaceSlug}/projects/${activity.project}/modules/${activity.old_identifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline items-center gap-1 font-medium text-primary hover:underline"
            >
              <span className="break-all">{activity.old_value}</span>
            </a>
            {" "}中移除了 <IssueLink activity={activity} />
          </>
        );
    },
    icon: <ModuleOutline className="h-3 w-3 !text-secondary" aria-hidden="true" />,
  },
  name: {
    message: (activity, showIssue) => (
      <>
        将标题设置为 <span className="break-all">{activity.new_value}</span>
        {showIssue && (
          <>
            ，工作项 <IssueLink activity={activity} />
          </>
        )}
      </>
    ),
    icon: <ChatOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  parent: {
    message: (activity, showIssue) => {
      if (!activity.new_value)
        return (
          <>
            移除了父工作项 <span className="font-medium whitespace-nowrap text-primary">{activity.old_value}</span>
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
      else
        return (
          <>
            将父工作项设置为 <span className="font-medium whitespace-nowrap text-primary">{activity.new_value}</span>
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
    },
    icon: <MembersOutline className="h-3 w-3 !text-secondary" aria-hidden="true" />,
  },
  priority: {
    message: (activity, showIssue) => (
      <>
        将优先级设置为{" "}
        <span className="font-medium text-primary">
          {activity.new_value ? (PRIORITY_LABELS[activity.new_value] ?? activity.new_value) : "无"}
        </span>
        {showIssue && (
          <>
            ，工作项 <IssueLink activity={activity} />
          </>
        )}
      </>
    ),
    icon: <PriorityMedium width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  relates_to: {
    message: (activity, showIssue) => {
      if (activity.old_value === "")
        return (
          <>
            标记了 {showIssue ? <IssueLink activity={activity} /> : "该工作项"} 关联到{" "}
            <span className="font-medium whitespace-nowrap text-primary">{activity.new_value}</span>。
          </>
        );
      else
        return (
          <>
            移除了与{" "}
            <span className="font-medium whitespace-nowrap text-primary">{activity.old_value}</span> 的关联。
          </>
        );
    },
    icon: <RelatesToOutline height="12" width="12" className="text-secondary" />,
  },
  blocking: {
    message: (activity, showIssue) => {
      if (activity.old_value === "")
        return (
          <>
            标记了 {showIssue ? <IssueLink activity={activity} /> : "该工作项"} 正在阻塞工作项{" "}
            <span className="font-medium whitespace-nowrap text-primary">{activity.new_value}</span>。
          </>
        );
      else
        return (
          <>
            移除了阻塞的工作项{" "}
            <span className="font-medium whitespace-nowrap text-primary">{activity.old_value}</span>。
          </>
        );
    },
    icon: <BlockerIcon height="12" width="12" className="text-secondary" />,
  },
  blocked_by: {
    message: (activity, showIssue) => {
      if (activity.old_value === "")
        return (
          <>
            标记了 {showIssue ? <IssueLink activity={activity} /> : "该工作项"} 被{" "}
            <span className="font-medium whitespace-nowrap text-primary">{activity.new_value}</span> 阻塞。
          </>
        );
      else
        return (
          <>
            移除了 {showIssue ? <IssueLink activity={activity} /> : "该工作项"} 被工作项{" "}
            <span className="font-medium whitespace-nowrap text-primary">{activity.old_value}</span> 阻塞的关系。
          </>
        );
    },
    icon: <BlockedIcon height="12" width="12" className="text-secondary" />,
  },
  duplicate: {
    message: (activity, showIssue) => {
      if (activity.old_value === "")
        return (
          <>
            标记了 {showIssue ? <IssueLink activity={activity} /> : "该工作项"} 为{" "}
            <span className="font-medium whitespace-nowrap text-primary">{activity.new_value}</span> 的重复项。
          </>
        );
      else
        return (
          <>
            移除了 {showIssue ? <IssueLink activity={activity} /> : "该工作项"} 作为{" "}
            <span className="font-medium whitespace-nowrap text-primary">{activity.old_value}</span> 重复项的标记。
          </>
        );
    },
    icon: <DuplicateOfOutline width={12} height={12} className="text-secondary" />,
  },
  state: {
    message: (activity, showIssue) => (
      <>
        将状态设置为 <span className="font-medium break-all text-primary">{activity.new_value}</span>
        {showIssue && (
          <>
            ，工作项 <IssueLink activity={activity} />
          </>
        )}
      </>
    ),
    icon: <GridOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  start_date: {
    message: (activity, showIssue) => {
      if (!activity.new_value)
        return (
          <>
            移除了开始日期
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
      else
        return (
          <>
            将开始日期设置为{" "}
            <span className="font-medium whitespace-nowrap text-primary">
              {renderFormattedDate(activity.new_value)}
            </span>
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
    },
    icon: <CalendarOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  target_date: {
    message: (activity, showIssue) => {
      if (!activity.new_value)
        return (
          <>
            移除了截止日期
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
      else
        return (
          <>
            将截止日期设置为{" "}
            <span className="font-medium whitespace-nowrap text-primary">
              {renderFormattedDate(activity.new_value)}
            </span>
            {showIssue && (
              <>
                ，工作项 <IssueLink activity={activity} />
              </>
            )}
          </>
        );
    },
    icon: <CalendarOutline width={12} height={12} className="text-secondary" aria-hidden="true" />,
  },
  inbox: {
    message: (activity, showIssue) => (
      <>
        {getInboxUserActivityMessage(activity, showIssue)}
        {showIssue && (
          <>
            {" "}
            <IssueLink activity={activity} />
          </>
        )}
        {activity.verb === "2" && `（标记为重复工作项）。`}
      </>
    ),
    icon: <IntakeOutline className="size-3 text-secondary" aria-hidden="true" />,
  },
};

export function ActivityIcon({ activity }: { activity: IIssueActivity }) {
  return <>{activityDetails[activity.field as keyof typeof activityDetails]?.icon}</>;
}

type ActivityMessageProps = {
  activity: IIssueActivity;
  showIssue?: boolean;
};

export function ActivityMessage({ activity, showIssue = false }: ActivityMessageProps) {
  // router params
  const { workspaceSlug } = useParams();
  const activityField = activity.field ?? "issue";

  return (
    <>
      {activityDetails[activityField as keyof typeof activityDetails]?.message(
        activity,
        showIssue,
        workspaceSlug ? workspaceSlug.toString() : (activity.workspace_detail?.slug ?? "")
      )}
    </>
  );
}
