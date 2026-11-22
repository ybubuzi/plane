/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { useState } from "react";
import { observer } from "mobx-react";
// plane imports
import { Button } from "@makeplane/propel/components/button";
import { PlaneLockup } from "@plane/blocks/icons";
import { CloseOutline } from "@makeplane/propel/icons";
// assets
import CyclesTour from "@/app/assets/onboarding/cycles.webp?url";
import IssuesTour from "@/app/assets/onboarding/issues.webp?url";
import ModulesTour from "@/app/assets/onboarding/modules.webp?url";
import PagesTour from "@/app/assets/onboarding/pages.webp?url";
import ViewsTour from "@/app/assets/onboarding/views.webp?url";
// hooks
import { useCommandPalette } from "@/hooks/store/use-command-palette";
import { useUser } from "@/hooks/store/user";
// local imports
import { TourSidebar } from "./sidebar";

export type TOnboardingTourProps = {
  onComplete: () => void;
};

export type TTourSteps = "welcome" | "work-items" | "cycles" | "modules" | "views" | "pages";

const TOUR_STEPS: {
  key: TTourSteps;
  title: string;
  description: string;
  image: string;
  prevStep?: TTourSteps;
  nextStep?: TTourSteps;
}[] = [
  {
    key: "work-items",
    title: "用工作项做计划",
    description:
      "工作项是 Plane 的基本构成单元。Plane 中的大多数概念都与工作项及其属性相关联。",
    image: IssuesTour,
    nextStep: "cycles",
  },
  {
    key: "cycles",
    title: "用迭代推进工作",
    description:
      "迭代（Cycle）帮助您和团队更快推进工作，类似于敏捷开发中常用的冲刺（Sprint）。",
    image: CyclesTour,
    prevStep: "work-items",
    nextStep: "modules",
  },
  {
    key: "modules",
    title: "用模块拆分",
    description: "模块将大任务拆分为项目或功能，帮助您更好地组织工作。",
    image: ModulesTour,
    prevStep: "cycles",
    nextStep: "views",
  },
  {
    key: "views",
    title: "视图",
    description:
      "创建自定义筛选，只显示您关心的工作项。几次点击即可保存并分享您的筛选。",
    image: ViewsTour,
    prevStep: "modules",
    nextStep: "pages",
  },
  {
    key: "pages",
    title: "用页面记录文档",
    description: "开会或开始一天工作时，用页面快速记录工作项。",
    image: PagesTour,
    prevStep: "views",
  },
];

export const TourRoot = observer(function TourRoot(props: TOnboardingTourProps) {
  const { onComplete } = props;
  // states
  const [step, setStep] = useState<TTourSteps>("welcome");
  // store hooks
  const { toggleCreateProjectModal } = useCommandPalette();
  const { data: currentUser } = useUser();

  const currentStepIndex = TOUR_STEPS.findIndex((tourStep) => tourStep.key === step);
  const currentStep = TOUR_STEPS[currentStepIndex];

  return (
    <>
      {step === "welcome" ? (
        <div className="w-4/5 overflow-hidden rounded-[10px] bg-surface-1 md:w-1/2 lg:w-2/5">
          <div className="h-full overflow-hidden">
            <div className="grid h-64 place-items-center bg-accent-primary">
              <PlaneLockup className="h-10 w-auto text-on-color" />
            </div>
            <div className="flex flex-col overflow-y-auto p-6">
              <h3 className="font-semibold sm:text-h5-regular">
                欢迎使用 Plane，{currentUser?.first_name} {currentUser?.last_name}
              </h3>
              <p className="mt-3 text-body-xs-regular text-secondary">
                我们很高兴您选择试用 Plane。您现在可以轻松管理项目了。从创建一个项目开始吧。
              </p>
              <div className="flex h-full items-end">
                <div className="mt-12 flex items-center gap-6">
                  <Button
                    variant="primary"
                    size="sm"
                    stretch="auto"
                    label="参加产品导览"
                    onClick={() => {
                      setStep("work-items");
                    }}
                  />
                  <button
                    type="button"
                    className="bg-transparent text-caption-sm-medium text-accent-primary outline-subtle-1"
                    onClick={() => {
                      onComplete();
                    }}
                  >
                    不用了，我自己探索
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative grid h-3/5 w-4/5 grid-cols-10 overflow-hidden rounded-[10px] bg-surface-1 sm:h-3/4 md:w-1/2 lg:w-3/5">
          <button
            type="button"
            className="fixed top-[19%] right-[9%] z-10 translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-strong bg-surface-1 p-1 sm:top-[11.5%] md:right-[24%] lg:right-[19%]"
            onClick={onComplete}
          >
            <CloseOutline className="border-strong- h-3 w-3 text-primary" />
          </button>
          <TourSidebar step={step} setStep={setStep} />
          <div className="col-span-10 h-full overflow-hidden lg:col-span-7">
            <div
              className={`flex h-1/2 items-end overflow-hidden bg-accent-primary sm:h-3/5 ${
                currentStepIndex % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <img src={currentStep?.image} className="h-full w-full object-cover" alt={currentStep?.title} />
            </div>
            <div className="flex h-1/2 flex-col overflow-y-auto p-4 sm:h-2/5">
              <h3 className="font-semibold sm:text-h5-regular">{currentStep?.title}</h3>
              <p className="mt-3 text-body-xs-regular text-secondary">{currentStep?.description}</p>
              <div className="mt-3 flex h-full items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                  {currentStep?.prevStep && (
                    <Button
                      variant="secondary"
                      size="sm"
                      stretch="auto"
                      label="返回"
                      onClick={() => setStep(currentStep.prevStep ?? "welcome")}
                    />
                  )}
                  {currentStep?.nextStep && (
                    <Button
                      variant="primary"
                      size="sm"
                      stretch="auto"
                      label="下一步"
                      onClick={() => setStep(currentStep.nextStep ?? "work-items")}
                    />
                  )}
                </div>
                {currentStepIndex === TOUR_STEPS.length - 1 && (
                  <Button
                    variant="primary"
                    size="sm"
                    stretch="auto"
                    label="创建您的第一个项目"
                    onClick={() => {
                      onComplete();
                      toggleCreateProjectModal(true);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
